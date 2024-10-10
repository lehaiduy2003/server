// server/models/product.js
const mongoose = require("mongoose");

// Define the schema, note that the name field for this schema has search index
const productsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  description: {
    content: { type: String, required: true },
    imgs: [{ type: String }],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  type: { type: String, required: true },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

// Create indexes
productsSchema.index({ status: true }, { price: 1 });
productsSchema.index({ status: true }, { createAt: -1 });
productsSchema.index({ status: true }, { type: 1 });

module.exports = mongoose.model("Products", productsSchema);
