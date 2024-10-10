require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const express = require("express");
const app = express();

const authRouter = require("./routers/authRouter");
const apiRouter = require("./routers/apiRouter");

const mongoosePromise = require("./configs/database");
const redisClientPromise = require("./configs/redis");

const port = process.env.PORT || 10000;
//config req.body
// app.use(express.json()) //for json
// app.use(express.urlencoded({ extended: true })) //for form data

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

//khai báo route
app.use("/auth", authRouter);
app.use("/", apiRouter);

(async () => {
  try {
    await Promise.all([mongoosePromise, redisClientPromise]);
  } catch (error) {
    console.error("Failed to connect to database", error);
  }
})()
  .then(() => {
    console.log("Connected to database and redis");
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => console.error("Failed to start server", error));
