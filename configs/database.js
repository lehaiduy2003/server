const mongoose = require("mongoose");

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Failed to connect to database", error);
  }
}

const mongoosePromise = connectToMongoDB();

module.exports = mongoosePromise;
