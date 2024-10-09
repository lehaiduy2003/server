// server/routers/homeRouter.js
const { getHomepage } = require("../controllers/homeController");
const { checkout } = require("../controllers/paymentController");
const { makeTransaction } = require("../controllers/transactionController");
const authenticateToken = require("../middlewares/authentication");

const apiRouter = require("express").Router();

apiRouter.get("/homepage", getHomepage);

apiRouter.post("/checkout", authenticateToken, (req, res) => {
  console.log("POST /api/checkout");
  checkout(req, res);
});

apiRouter.post("/create-transaction", authenticateToken, (req, res) => {
  console.log("POST /api/create-transaction");
  makeTransaction(req, res);
});

apiRouter.post("/change-transaction-status", authenticateToken, (req, res) => {
  console.log("POST /api/change-transaction-status");
  changeTransactionStatus(req, res);
});

module.exports = apiRouter;
