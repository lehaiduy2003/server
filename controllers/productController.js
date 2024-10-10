const { saveToCache } = require("../middlewares/cacheMiddleware");
const errorHandler = require("../middlewares/errorMiddleware");
const { getHomepageData, getProducts } = require("../services/homeService");

async function getHomepage(req, res) {
  const { limit, skip } = req.query;

  try {
    const homepageData = await getHomepageData(limit, skip);
    if (!homepageData)
      res.status(502).send({ error: "No homepage data found" });

    res.status(200).send(homepageData);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

async function searchProducts(req, res) {
  const { name, sort, orderBy, limit } = req.query;

  try {
    const products = await getProducts(name, sort, orderBy, limit);
    if (!products) res.status(502).send({ error: "No products found" });
    // Save the results to the cache
    if (req.cacheKey) {
      await saveToCache(req.cacheKey, products);
    }
    res.status(200).send(products);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

module.exports = { getHomepage, searchProducts };
