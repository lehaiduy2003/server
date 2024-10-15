import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

import express from "express";
const app = express();

import { mongoosePromise, closeMongoose } from "./configs/database";
import { redisClientPromise, closeRedis } from "./configs/redis";
import BaseRouter from "./routers/OriginRouter";

const port = process.env.PORT ? parseInt(process.env.PORT) : 10000;
const host = process.env.HOST || "localhost";

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

(async () => {
  try {
    await Promise.all([mongoosePromise, redisClientPromise]);
  } catch (error) {
    console.error("Failed to connect to database and redis", error);
  }
})()
  .then(() => {
    console.log("Connected to database and redis");
    BaseRouter.start(app, port);
    app.listen(port, host, () => {
      console.log(`Local server listening on http://${host}:${port}`);
    });
  })
  .catch((error) => async () => {
    console.error("Failed to start server", error);
    await Promise.all([closeMongoose(), closeRedis()]);
  });
