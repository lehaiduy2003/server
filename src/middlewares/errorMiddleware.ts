import { Response } from "express";

import { closeMongoose } from "../configs/database";
import { closeRedis } from "../configs/redis";

// Error handling middleware
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function errorHandler(err: any, res: Response): Promise<void> {
  console.error(err.stack); // Log the error stack for debugging
  await closeMongoose(); // Close the database connection
  await closeRedis(); // Close the Redis connection
  res.status(err.status || 500).send({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
