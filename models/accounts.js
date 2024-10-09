// server/models/product.js
const mongoose = require("mongoose");

const accountsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String("admin" | "buyer" | "seller" | "recycler"),
    required: true,
    default: "buyer",
  },
  createAt: { type: Date, required: true, default: Date.now },
  updateAt: { type: Date, required: true, default: Date.now },
  identityCard: {
    front: { type: String },
    back: { type: String },
  },
  isVerified: { type: Boolean, required: true, default: false },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
  recyclerFields: {
    recyclingLicenseNumber: { type: String },
    recyclingCapacity: { type: Number },
  },
});

// Pre-save hook to check account type and conditionally add fields
accountsSchema.pre("save", async function (next) {
  const account = await mongoose.model("Accounts").findById(this._id);
  if (account && account.type === "recycler") {
    // Ensure recycler fields are present
    this.recyclerFields = this.recyclerFields || {};
  } else {
    // Remove recycler fields if not a recycler
    this.recyclerFields = undefined;
  }
  next();
});

// Create indexes
accountsSchema.index({ email: 1 }, { unique: true });
accountsSchema.index({ role: 1 });
accountsSchema.index({ createAt: 1 });

module.exports = mongoose.model("Accounts", accountsSchema);
