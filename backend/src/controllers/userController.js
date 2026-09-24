const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// POST /api/users/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // تحقق من عدم وجود البريد
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email.toLowerCase(),
    ]);

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email.toLowerCase(), hash],
    );

    const token = jwt.sign(
      { id: result.insertId, name, email: email.toLowerCase(), role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        token,
        user: { id: result.insertId, name, email: email.toLowerCase() },
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email.toLowerCase(),
    ]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/me
exports.getMe = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT id, name, email, phone, address, created_at
       FROM users WHERE id = ?`,
      [req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/orders — سجل مشتريات المستخدم
exports.getMyOrders = async (req, res, next) => {
  try {
    const [orders] = await db.query(
      `SELECT id, total, status, created_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id],
    );

    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/orders/:id — تفاصيل طلب (مع التحقق أنه يخص المستخدم)
exports.getMyOrderById = async (req, res, next) => {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const [items] = await db.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [req.params.id],
    );

    res.json({ success: true, data: { ...orders[0], items } });
  } catch (err) {
    next(err);
  }
};

// ============================================
// GET /api/users/stats — إحصائيات طلبات المستخدم
// ============================================
exports.getMyStats = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT status, COUNT(*) AS count
       FROM orders
       WHERE user_id = ?
       GROUP BY status`,
      [req.user.id],
    );

    const stats = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      total: 0,
    };

    rows.forEach((r) => {
      stats[r.status] = r.count;
      stats.total += r.count;
    });

    // يمكن الحذف فقط إذا لا توجد طلبات قيد المعالجة
    const inProgress = stats.pending + stats.confirmed + stats.shipped;
    const canDelete = inProgress === 0;

    res.json({
      success: true,
      data: { ...stats, in_progress: inProgress, canDelete },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/me
exports.updateMe = async (req, res, next) => {
  try {
    const { name, email, phone, address, new_password, current_password } =
      req.body;
    const userId = req.user.id;

    // 1) جلب المستخدم الحالي
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];
    const newName = name?.trim() || user.name;
    const newEmail = email?.toLowerCase().trim() || user.email;
    const newPhone = phone !== undefined ? phone?.trim() || null : user.phone;
    const newAddress =
      address !== undefined ? address?.trim() || null : user.address;

    // 2) إذا تغيّر البريد → تحقق من عدم استخدامه
    if (newEmail !== user.email) {
      const [existing] = await db.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [newEmail, userId],
      );
      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // 3) إذا أراد تغيير كلمة السر
    let newPasswordHash = user.password_hash;
    if (new_password) {
      if (!current_password) {
        return res.status(400).json({
          success: false,
          message: "Current password is required to change password",
        });
      }

      const match = await bcrypt.compare(current_password, user.password_hash);
      if (!match) {
        return res.status(401).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      if (new_password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters",
        });
      }

      newPasswordHash = await bcrypt.hash(new_password, 10);
    }

    // 4) حدّث
    await db.query(
      `UPDATE users
       SET name = ?, email = ?, phone = ?, address = ?, password_hash = ?
       WHERE id = ?`,
      [newName, newEmail, newPhone, newAddress, newPasswordHash, userId],
    );

    // 5) أصدر توكن جديد
    const token = jwt.sign(
      { id: userId, name: newName, email: newEmail, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.json({
      success: true,
      message: "Profile updated",
      data: {
        token,
        user: {
          id: userId,
          name: newName,
          email: newEmail,
          phone: newPhone,
          address: newAddress,
          created_at: user.created_at,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// ============================================
// DELETE /api/users/me — حذف الحساب
// ============================================
exports.deleteMe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    // 1) تحقق من كلمة السر
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // 2) تحقق من عدم وجود طلبات قيد المعالجة
    const [pending] = await db.query(
      `SELECT COUNT(*) AS count FROM orders
       WHERE user_id = ? AND status IN ('pending', 'confirmed', 'shipped')`,
      [userId],
    );

    if (pending[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `You have ${pending[0].count} order(s) in progress. Wait until they are delivered or cancel them first.`,
      });
    }

    // 3) احذف المستخدم (الطلبات تبقى مع user_id = NULL)
    await db.query("DELETE FROM users WHERE id = ?", [userId]);

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
