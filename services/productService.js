const {
  findProducts,
  findProductsWithFilter,
} = require("../repositories/productRepository");

async function getProducts(limit, skip) {
  try {
    const products = await findProducts(limit, skip);

    return {
      products,
    };
  } catch (error) {
    console.error("Error getting homepage data:", error);
    throw error;
  }
}

async function searchProducts(name, sort, orderBy, limit) {
  const products = await findProductsWithFilter(name, sort, orderBy, limit);

  if (!products) throw new Error("can not get products from database: ");

  return products;
}

module.exports = {
  getProducts,
  searchProducts,
};
