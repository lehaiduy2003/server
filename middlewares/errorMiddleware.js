// Error handling middleware
const errorHandler = (err, req, res) => {
  console.error(err); // Log the error stack for debugging

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
