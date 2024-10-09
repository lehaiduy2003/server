const { getHomepage } = require("../controllers/productController");
const authenticateToken = require("../middlewares/authentication");
const express = require("express");
const webRouter = express.Router();

webRouter.get("/", authenticateToken, (req, res) => {
  console.log("GET /");
  getHomepage(req, res);
});

module.exports = webRouter;
