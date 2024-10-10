const { closeMongoose } = require("../configs/database");
const { closeRedis } = require("../configs/redis");

// Error handling middleware
const errorHandler = async (err, req, res) => {
  console.error(err); // Log the error stack for debugging
  await closeMongoose(); // Close the database connection
  await closeRedis(); // Close the Redis connection
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
