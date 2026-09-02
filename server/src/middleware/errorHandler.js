// Global error handling middleware
function errorHandler(err, req, res, next) {
  console.error("Unhandled Server Error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  return res.status(status).json({ error: message });
}

module.exports = errorHandler;
