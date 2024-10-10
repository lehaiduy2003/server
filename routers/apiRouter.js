// server/routers/homeRouter.js
const {
  getProductsData,
  searchProductsData,
} = require("../controllers/productController");
const { checkout } = require("../controllers/paymentController");
const {
  makeTransaction,
  changeTransactionStatus,
} = require("../controllers/transactionController");

const authenticateToken = require("../middlewares/authMiddleware");
const { checkCache } = require("../middlewares/cacheMiddleware");

const apiRouter = require("express").Router();

apiRouter.get("/products", authenticateToken, (req, res) => {
  console.log("GET /products");
  getProductsData(req, res);
});

apiRouter.get("/products/search", authenticateToken, checkCache, (req, res) => {
  console.log("GET /products/search");
  searchProductsData(req, res);
});

apiRouter.post("/checkout", authenticateToken, (req, res) => {
  console.log("POST /checkout");
  checkout(req, res);
});

apiRouter.post("/transactions", authenticateToken, (req, res) => {
  console.log("POST /transactions");
  makeTransaction(req, res);
});

apiRouter.patch("/transactions/:id", authenticateToken, (req, res) => {
  console.log("PATCH /transactions/:id");
  changeTransactionStatus(req, res);
});

module.exports = apiRouter;
