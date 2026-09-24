const express = require("express");
const cors = require("cors");
require("dotenv").config();

// استيراد الاتصال بقاعدة البيانات (سيختبر الاتصال تلقائياً)
require("./src/config/db");

const { errorHandler, notFound } = require("./src/middleware/errorHandler");

const app = express();

// ===== Middleware =====
// ===== CORS =====
// ===== CORS =====
const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin: (origin, callback) => {
      // اسمح بالطلبات بدون origin (Postman, mobile)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // اسمح بكل نطاقات Vercel
      if (origin.endsWith(".vercel.app")) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== Health Check =====
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/products", require("./src/routes/products"));
app.use("/api/categories", require("./src/routes/categories"));
app.use("/api/orders", require("./src/routes/orders"));
app.use("/api/admin", require("./src/routes/admin"));
app.use("/api/users", require("./src/routes/users"));
app.use("/api/auth", require("./src/routes/auth"));

// ===== 404 + Error Handler =====
app.use(notFound);
app.use(errorHandler);

// ===== Start Server =====
// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
