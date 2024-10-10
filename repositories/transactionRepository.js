const Transactions = require("../models/transactions");

/**
 * insert new transaction into transactions collection
 * @param {object} products: {_id, name, img, price, quantity}
 * @param {object} buyer: {_id, address, phone}
 * @param {object} seller: {_id, address, phone}
 * @param {number} shippingFee (default = 30000)
 * @returns {Promise<Document<Transactions> | null>}
 */
async function insertTransaction(products, buyer, seller, shippingFee = 30000) {
  try {
    const transaction = await Transactions.create({
      buyer: buyer,
      seller: seller,
      products: products,
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
  try {
    const updatedTransaction = await Transactions.findByIdAndUpdate(
      _id,
      { status: status },
      { new: true } // This option returns the updated document
    );
    return updatedTransaction;
  } catch (error) {
    console.error("error while updating transaction status: ");
    throw error;
  }
}
module.exports = { insertTransaction, updateTransactionStatusByID };
