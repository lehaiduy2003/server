// server/models/product.js
import { Schema } from "mongoose";
import BaseModel from "./BaseModel";
import { IPayment, Payment } from "../libs/zod/models/Payment";

const paymentsSchema: Schema<Payment> = new Schema({
  date: {
    type: String,
    required: true,
  },
  type: { type: String, enum: ["visa", "mastercard"], required: true },
  cardHolder: { type: String, required: true },
  cardNumber: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true },
});

paymentsSchema.index({ type: 1 });
paymentsSchema.index({ account: 1 });
paymentsSchema.index({ date: 1 });

export default class Payments extends BaseModel<IPayment> {
  private static instance: Payments;

  private constructor() {
    super("Payments", paymentsSchema);
  }

  public static getInstance(): Payments {
    if (!Payments.instance) {
      Payments.instance = new Payments();
    }
    return Payments.instance;
  }
}
