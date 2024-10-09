// server/routers/homeRouter.js
const { getHomepage } = require("../controllers/homeController");
const authenticateToken = require("../middlewares/authentication");

const apiRouter = require("express").Router();

apiRouter.get("/homepage", getHomepage);

apiRouter.post("/create-payment-intent", authenticateToken, (req, res) => {
  console.log("POST /api/create-payment-intent");
});

apiRouter.post("/create-transaction", authenticateToken, (req, res) => {
  console.log("POST /api/create-transaction");
});

module.exports = apiRouter;
