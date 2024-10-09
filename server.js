const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const webRouter = require("./routers/webRouter");
const authRouter = require("./routers/authRouter");
const apiRouter = require("./routers/apiRouter");

const mongoose = require("mongoose");
const { connectDb } = require("./configs/database");

const port = process.env.PORT || 10000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/", webRouter);
app.use("/auth", authRouter);
app.use("/api", apiRouter);

const dbURL = process.env.DATABASE_URL;
mongoose.connect(dbURL, { serverSelectionTimeoutMS: 30000 });

async function connectToDatabase() {
  try {
    await connectDb();
    console.log("Connected to database");
  } catch (error) {
    console.error("Failed to connect to database", error);
  }
}
connectToDatabase()
  .then(() =>
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    })
  )
  .catch((error) => console.error("Failed to start server", error));
