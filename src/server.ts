import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

import express from "express";
const app = express();

import authRouter from "./routers/authRouter";
import apiRouter from "./routers/apiRouter";
import { mongoDBConnection } from "./configs/database";
import { redisConnection } from "./configs/redis";

const port = process.env.PORT ? parseInt(process.env.PORT) : 10000;

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
    await Promise.all([mongoDBConnection.connect(), redisConnection.connect()]);
  } catch (error) {
    console.error("Failed to connect to database and redis", error);
  }
})()
  .then(() => {
    console.log("Connected to database and redis");
    app.use("/", apiRouter);
    app.use("/auth", authRouter);
    app.listen(port, () => {
      console.log(`server listening on port ${port}`);
    });
  })
  .catch((error) => async () => {
    console.error("Failed to start server", error);
    await Promise.all([mongoDBConnection.close(), redisConnection.close()]);
  });
