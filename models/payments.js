// server/models/product.js
const mongoose = require("mongoose");

// Regular expression to match MM/YY format
const dateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

const paymentsSchema = new mongoose.Schema({
  type: { type: String, required: true },
  account: { type: String, required: true },
  // Validate date format using the dateRegex
  date: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return dateRegex.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid date format! Use MM/YY.`,
    },
  },
});

// Create indexes
paymentsSchema.index({ type: 1 });
paymentsSchema.index({ account: 1 });
paymentsSchema.index({ date: 1 });

module.exports = mongoose.model("Payments", paymentsSchema);
