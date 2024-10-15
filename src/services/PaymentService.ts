import dotenv from "dotenv";
import Stripe from "stripe";
import { ClientSession } from "mongoose";

import BaseService from "./init/BaseService";

import { CheckoutProductDTO } from "../libs/zod/dto/CheckoutProductDTO";

import { calculateOrderAmount } from "../utils/currency";
import { IPayment, Payment } from "../libs/zod/model/Payment";
import PaymentsModel from "../models/PaymentsModel";

dotenv.config();
const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

export default class PaymentService extends BaseService<PaymentsModel> {
  public constructor() {
    super("payment");
  }

  /**
   * create a payment intent with stripe, return the payment intent client secret
   * @param {[{id: ObjectId, name: string, img: string, price: number, quantity: number}]} items
   * @returns {Promise<string>}
   */
  async createPaymentIntent(products: CheckoutProductDTO[]): Promise<string | null> {
    await this.startSession();
    this.startTransaction();
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(products),
        currency: "vnd",
      });

      if (!paymentIntent) {
        await this.abortTransaction();
        return null;
      }
      await this.commitTransaction();
      return paymentIntent.client_secret;
    } catch (error) {
      await this.abortTransaction();
      console.error(error);
      throw new Error("error while creating payment intent");
    } finally {
      await this.endSession();
    }
  }
}
