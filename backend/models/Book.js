const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  country: { type: String }
});

module.exports = mongoose.model("Book", BookSchema);