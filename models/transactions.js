const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  buyer: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfiles",
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    required: true,
  },
  seller: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfiles",
    },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    required: true,
  },
  products: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      name: { type: String, required: true },
      img: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, require: true },
      required: true,
    },
  ],
  shippingFee: { type: Number, default: 30000 },
  status: {
    type: "pending" | "shipping" | "completed" | "refunded",
    required: true,
    default: "pending",
  },
});

transactionsSchema.index({ "products.id": 1 });
transactionsSchema.index({ status: 1 });
transactionsSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Transactions", transactionsSchema);
