import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectToMongoDB(): Promise<typeof mongoose> {
  try {
    const database = await mongoose.connect(String(process.env.DATABASE_URL), {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected to database");
    return database;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to connect to database");
  }
}

const mongoosePromise = connectToMongoDB();

async function closeMongoose() {
  (await mongoosePromise).disconnect();
}

export { mongoosePromise, closeMongoose };
