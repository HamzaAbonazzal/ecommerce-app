// Middleware موحّد للأخطاء
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

// Middleware للـ 404
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };
