const Transactions = require("../models/transactions");
const { ObjectId } = require("mongodb");

/**
 * insert new transaction into transactions collection
 * @param {object} items: {id, name, img, price, quantity}
 * @param {object} buyer: {id, address, phone}
 * @param {object} seller: {id, address, phone}
 * @param {number} shippingFee (default = 30000)
 * @returns {Promise<Document<Transactions> | null>}
 */
async function insertNewTransaction(items, buyer, seller, shippingFee = 30000) {
  try {
    const transaction = await Transactions.create({
      buyer: buyer,
      seller: seller,
      products: items,
      shippingFee: shippingFee,
    });
    console.log(transaction);
    return transaction;
  } catch (error) {
    console.error("error while inserting into database: ", error);
    return null;
  }
}

/**
 * update transaction status by transaction _id.
 * @param {string} _id
 * @param {"pending" | "shipping" | "completed" | "refunded"} status
 * @returns {Promise<Boolean>}
 */
async function updateTransactionStatusByID(_id, status) {
  const id = ObjectId.createFromHexString(_id); // Convert string id to ObjectId
  try {
    await Transactions.findByIdAndUpdate(id, { status: status });
    return true;
  } catch (error) {
    console.error("error while updating transaction status: ", error);
    return false;
  }
}
module.exports = { insertNewTransaction, updateTransactionStatusByID };
