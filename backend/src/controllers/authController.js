const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// POST /api/auth/login  →  دخول موحّد (أدمن أو مستخدم)
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ============ 1) جرّب الأدمن أولاً ============
    const [admins] = await db.query("SELECT * FROM admins WHERE email = ?", [
      normalizedEmail,
    ]);

    if (admins.length > 0) {
      const admin = admins[0];
      const isMatch = await bcrypt.compare(password, admin.password_hash);

      if (isMatch) {
        const token = jwt.sign(
          {
            id: admin.id,
            username: admin.username,
            email: admin.email,
            role: "admin",
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
        );

        return res.json({
          success: true,
          data: {
            role: "admin",
            token,
            admin: {
              id: admin.id,
              username: admin.username,
              email: admin.email,
            },
          },
        });
      }
    }

    // ============ 2) جرّب المستخدم ============
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
      normalizedEmail,
    ]);

    if (users.length > 0) {
      const user = users[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (isMatch) {
        const token = jwt.sign(
          {
            id: user.id,
            name: user.name,
            email: user.email,
            role: "user",
          },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
        );

        return res.json({
          success: true,
          data: {
            role: "user",
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          },
        });
      }
    }

    // ============ لا شيء طابق ============
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (err) {
    next(err);
  }
};
