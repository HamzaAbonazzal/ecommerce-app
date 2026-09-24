const jwt = require("jsonwebtoken");
require("dotenv").config();

const userAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "User access required",
      });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// middleware اختياري — يربط المستخدم إذا التوكن موجود، لكن لا يمنع الزوار
const optionalUserAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      const token = header.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === "user") req.user = decoded;
    }
  } catch (err) {
    // تجاهل — زائر عادي
  }
  next();
};

module.exports = { userAuth, optionalUserAuth };
