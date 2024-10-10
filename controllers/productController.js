const { saveToCache } = require("../middlewares/cacheMiddleware");
const errorHandler = require("../middlewares/errorMiddleware");
const { getProducts, searchProducts } = require("../services/productService");

async function getProductsData(req, res) {
  const { limit, skip } = req.query;

  try {
    const products = await getProducts(limit, skip);
    if (!products || products.length === 0)
      return res.status(404).send({ error: "No homepage data found" });

    res.status(200).send(products);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

async function searchProductsData(req, res) {
  const { name, sort, orderBy, limit } = req.query;

  try {
    const products = await searchProducts(name, sort, orderBy, limit);

    if (!products || products.length === 0)
      return res.status(404).send({ error: "No searched result found" });

    // Save the results to the cache
    if (req.cacheKey) {
      await saveToCache(req.cacheKey, products);
    }
    res.status(200).send(products);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

module.exports = { getProductsData, searchProductsData };
