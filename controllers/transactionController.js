async function makeTransactions(req, res) {
  const { items, buyer, seller } = req.body;

  if (!items || !buyer || !seller)
    res.status(400).send({ error: "invalid data provided" });

  try {
    const transaction = await createTransaction(items, buyer, seller);

    if (!transaction) res.status(502).send({ error: "No transaction created" });

    res.status(201).send(transaction);
  } catch (error) {
    res.sendStatus(500);
  }
}
