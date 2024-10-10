const {
  getHomepageProducts,
  findProductsWithFilter,
} = require("../repositories/productRepository");

async function getHomepageData(limit, skip) {
  try {
    const latestProducts = await getHomepageProducts(limit, skip);

    return {
      latestProducts,
    };
  } catch (error) {
    console.error("Error getting homepage data:", error);
    throw error;
  }
}

async function getProducts(name, sort, orderBy, limit) {
  const products = await findProductsWithFilter(name, sort, orderBy, limit);

  if (!products) throw new Error("can not get products from database: ");

  return products;
}

module.exports = {
  getHomepageData,
  getProducts,
};
