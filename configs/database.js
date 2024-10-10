const mongoose = require("mongoose");
require("dotenv").config();

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

async function closeMongoose() {
  if (mongoosePromise) {
    await mongoosePromise.disconnect();
  }
}

module.exports = { mongoosePromise, closeMongoose };
