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
    res.sendStatus(500);
  }
}

async function changeTransactionStatus(req, res) {
  const { transactionId, status } = req.body;

  if (!transactionId || !status)
    res.status(400).send({ error: "invalid data provided" });

  try {
    const updatedTransaction = await updateTransactionStatus(
      transactionId,
      status
    );

    if (!updatedTransaction)
      res.status(502).send({ error: "No transaction updated" });

    res.status(200).send(updatedTransaction);
  } catch (error) {
    res.sendStatus(500);
  }
}

module.exports = { makeTransaction, changeTransactionStatus };
