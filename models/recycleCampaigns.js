// server/models/product.js
const mongoose = require("mongoose");

const recycleCampaignsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  description: {
    content: { type: String, required: true },
    imgs: [{ type: String }],
  },
  recycledWeight: { type: Number, required: true },
  recycledAmount: { type: Number, required: true },
  participants: { type: Number, required: true },
  createAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserProfiles",
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

recycleCampaignsSchema.index({ status: true }, { name: 1 });
recycleCampaignsSchema.index({ createAt: 1 });
recycleCampaignsSchema.index({ status: true }, { userId: 1 });

module.exports = mongoose.model("recycleCampaigns", recycleCampaignsSchema);
