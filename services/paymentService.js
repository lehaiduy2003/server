const { calculateOrderAmount } = require("../utils/currency");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * create a payment intent with stripe, return the payment intent client secret
 * @param {[{id: ObjectId, name: string, img: string, price: number, quantity: number}]} items
 * @returns {Promise<string>}
 */
const createPaymentIntent = async (products) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(products),
      currency: "vnd",
    });

    if (!paymentIntent) throw new Error("error while creating payment intent");

    return paymentIntent.client_secret;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { createPaymentIntent };
