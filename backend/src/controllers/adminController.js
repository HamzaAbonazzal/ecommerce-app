const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// POST /api/admin/login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const [rows] = await db.query("SELECT * FROM admins WHERE username = ?", [
      username,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    res.json({
      success: true,
      data: { token, admin: { id: admin.id, username: admin.username } },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/me
exports.getMe = (req, res) => {
  res.json({ success: true, data: req.admin });
};

// GET /api/admin/products
exports.getAllProducts = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`,
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/products
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, image_url, category_id } =
      req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const [result] = await db.query(
      `INSERT INTO products (name, description, price, stock, image_url, category_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        price,
        stock || 0,
        image_url || null,
        category_id || null,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Product created",
      data: { id: result.insertId },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/admin/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, image_url, category_id } =
      req.body;

    const [existing] = await db.query("SELECT id FROM products WHERE id = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await db.query(
      `UPDATE products
       SET name = ?, description = ?, price = ?, stock = ?, image_url = ?, category_id = ?
       WHERE id = ?`,
      [
        name,
        description || null,
        price,
        stock || 0,
        image_url || null,
        category_id || null,
        id,
      ],
    );

    res.json({ success: true, message: "Product updated" });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;

    let sql = "SELECT * FROM orders";
    const params = [];

    if (status) {
      sql += " WHERE status = ?";
      params.push(status);
    }

    sql += " ORDER BY created_at DESC";

    const [rows] = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/orders/:id
exports.getOrderById = async (req, res, next) => {
  try {
    const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
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

// PATCH /api/admin/orders/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowed.join(", ")}`,
      });
    }

    const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, req.params.id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated" });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [[productsCount]] = await db.query(
      "SELECT COUNT(*) AS total FROM products",
    );
    const [[ordersCount]] = await db.query(
      "SELECT COUNT(*) AS total FROM orders",
    );
    const [[pendingCount]] = await db.query(
      "SELECT COUNT(*) AS total FROM orders WHERE status = 'pending'",
    );
    const [[revenue]] = await db.query(
      "SELECT COALESCE(SUM(total), 0) AS total FROM orders WHERE status != 'cancelled'",
    );
    const [[lowStock]] = await db.query(
      "SELECT COUNT(*) AS total FROM products WHERE stock < 10",
    );

    res.json({
      success: true,
      data: {
        products: productsCount.total,
        orders: ordersCount.total,
        pending_orders: pendingCount.total,
        revenue: Number(revenue.total),
        low_stock: lowStock.total,
      },
    });
  } catch (err) {
    next(err);
  }
};
