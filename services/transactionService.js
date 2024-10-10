const { ObjectId } = require("mongodb");
const {
  updateTransactionStatusByID,
  insertTransaction,
} = require("../repositories/transactionRepository");
const { decodeData, encodeData } = require("../utils/data");

/**
 * TODO: Implement the encodeProductPrices function
 * Decodes the prices of all products in the array
 * @param {[{id: ObjectId, img: string, name: string, price: number, quantity: number}]} products - The products array
 * @returns {[{id: ObjectId, img: string, name: string, price: number, quantity: number}]} - The products array with decoded prices
 */
function encodeProductPrices(products) {
  return products.map((product) => ({
    ...product,
    price: encodeData(product.price),
    quantity: encodeData(product.quantity),
  }));
}

/**
 * @param {[products:{id: ObjectId, img: string, name: string, price: number, quantity: number}]} products
 * @param {id: ObjectId, address: string, phone: string} buyer
 * @param {id: ObjectId, address: string, phone: string} seller
 * @returns {Promise<Document<Transactions> | null>}
 */
async function createTransaction(products, buyer, seller) {
  try {
    const transaction = await insertTransaction(products, buyer, seller);
    return transaction;
  } catch (error) {
    console.error("error while create transaction: ", error);
    return null;
  }
}

/**
 *
 * @param {string} transactionId
 * @param {"pending" | "shipping" | "completed" | "refunded"} status
 * @returns
 */
async function updateTransactionStatus(transactionId, status) {
  const id = ObjectId.createFromHexString(transactionId); // Convert string id to ObjectId
  try {
    const updatedTransaction = await updateTransactionStatusByID(id, status);
    return updatedTransaction;
  } catch (error) {
    console.error("error while updating transaction: ", error);
    return null;
  }
}

module.exports = { createTransaction, updateTransactionStatus };
