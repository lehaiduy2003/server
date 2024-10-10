// const prisma = require("../prisma/db");
const Products = require("../models/products");
async function getHomepageProducts(limit = 10, scroll = 1) {
  try {
    const skip = (scroll - 1) * limit;
    const products = await Products.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
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

// TODO: try to benchmark the performance of the search index
/**
 * using search index to find products with filter
 * @param {string} name
 * @param {string} sort
 * @param {string} orderBy: 1 or -1
 * @param {number} limit
 * @returns {[Products]}
 */
async function findProductsWithFilter(
  name,
  sort = "createdAt",
  orderBy = -1,
  limit = 10
) {
  try {
    const products = await Products.aggregate([
      {
        $search: {
          index: "product_name", // index name
          text: {
            query: name, // query search
            path: "name", // search in name field
            fuzzy: { maxEdits: 1 }, // optional fuzzy search for incorrect characters (maxEdits: 1)
          },
        },
      },
      { $sort: { [sort]: Number(orderBy) } },
      { $limit: limit },
    ]);
    return products;
  } catch (error) {
    console.error("Error getting products with filter: ", error);
    throw error;
  }
}

module.exports = { getHomepageProducts, findProductsWithFilter };
