// server/models/product.js
const mongoose = require("mongoose");

const activitiesSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  log: { type: String, required: true },
  actor: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accounts",
      required: true,
    },
    role: { type: String, enum: ["buyer", "recycler", "admin", "seller"] },
  },
});

activitiesSchema.index({ date: 1 });
activitiesSchema.index({ "actor.id": 1 });
activitiesSchema.index({ "actor.role": 1 });

module.exports = mongoose.model("Activities", activitiesSchema);
