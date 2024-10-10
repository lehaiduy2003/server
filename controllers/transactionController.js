const errorHandler = require("../middlewares/errorMiddleware");
const {
  createTransaction,
  updateTransactionStatus,
} = require("../services/transactionService");

async function makeTransaction(req, res) {
  const { products, buyer, seller } = req.body;

  if (!products || !buyer || !seller)
    res.status(400).send({ error: "invalid data provided" });

  try {
    const transaction = await createTransaction(products, buyer, seller);

    if (!transaction) res.status(502).send({ error: "No transaction created" });

    res.status(201).send(transaction);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

async function changeTransactionStatus(req, res) {
  const { status } = req.body;
  const { id } = req.params;

  if (!id || !status)
    return res.status(400).send({ error: "invalid data provided" });

  try {
    const updatedTransaction = await updateTransactionStatus(id, status);

    if (!updatedTransaction)
      return res.status(502).send({ error: "No transaction updated" });

    return res.status(200).send(updatedTransaction);
  } catch (error) {
    errorHandler(error, req, res);
  }
}

// TODO: Implement getTransactionHistory function
async function getTransactionHistory(req, res) {}

module.exports = { makeTransaction, changeTransactionStatus };
