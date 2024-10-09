// server/routers/homeRouter.js
const { getHomepage } = require("../controllers/homeController");

const apiRouter = require("express").Router();

apiRouter.get("/homepage", getHomepage);

module.exports = apiRouter;
