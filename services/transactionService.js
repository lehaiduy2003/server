async function createTransaction(items, buyer, seller) {
  try {
    const transaction = await insertNewTransaction(items, buyer, seller);
    return transaction;
  } catch (error) {
    console.error("error while create transaction: ", error);
    return null;
  }
}

module.exports = { createTransaction };
