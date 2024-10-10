const { createPaymentIntent } = require("../services/paymentService");

/**
 * @description create a payment intent and return client secret
 */
async function checkout(req, res) {
  const { products } = req.body;

  if (!products) res.status(400).send({ error: "invalid data provided" });

  console.log(products);

  try {
    const clientSecret = await createPaymentIntent(products);

    if (!clientSecret)
      res.status(502).send({ error: "no payment intent created" });

    res.status(201).send({ clientSecret: clientSecret });
  } catch (error) {
    errorHandler(error, req, res);
  }
}

module.exports = { checkout };
