// const prisma = require("../prisma/db");
const Products = require("../models/products");

async function getLatestProducts(limit = 5) {
  try {
    const products = await Products.find().sort({ createdAt: -1 }).limit(limit);
    return products;
  } catch (error) {
    console.error("Error getting latest products:", error);
    throw error;
  }
  // // test
  // const explainResult = await Product.find()
  //   .sort({ createdAt: -1 })
  //   .limit(limit)
  //   .explain();
  // console.log(explainResult);
}

module.exports = { getLatestProducts };
