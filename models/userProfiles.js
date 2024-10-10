const mongoose = require("mongoose");

const userProfilesSchema = new mongoose.Schema({
  name: { type: String },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        // Allow empty strings or valid phone numbers
        return v === "" || /^[0-9]{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  avatar: { type: String },
  dob: { type: Date },
  bio: { type: String },
  address: [{ type: String }],
  reputationScore: { type: Number, default: 100, required: true },
  followers: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  bought: { type: Number, default: 0 },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accounts",
    required: true,
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
  payments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Payments" }],
  cart: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      img: { type: String },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number },
    },
  ],
  likes: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
      img: { type: String },
      name: { type: String },
      price: { type: Number },
    },
  ],
  following: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfiles" },
      name: { type: String },
      avatar: { type: String },
    },
  ],
});

userProfilesSchema.index({ phone: 1 }, { unique: true, sparse: true });
userProfilesSchema.index({ accountId: 1 }, { unique: true });
userProfilesSchema.index({ reputationScore: 1 });

module.exports = mongoose.model("UserProfiles", userProfilesSchema);
