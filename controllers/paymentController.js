const { createPaymentIntent } = require("../services/paymentService");

/**
 * @description create a payment intent and return client secret
 */
async function checkout(req, res) {
  const { items } = req.body;

  if (!items) res.status(400).send({ error: "invalid data provided" });

  try {
    const clientSecret = await createPaymentIntent(items);

    if (!clientSecret)
      res.status(502).send({ error: "no payment intent created" });

    res.status(201).send({ clientSecret: clientSecret });
  } catch (error) {
    res.sendStatus(500);
  }
}

module.exports = { checkout };
