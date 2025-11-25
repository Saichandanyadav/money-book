const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ["credit", "debit"], required: true },
  modeOfPayment: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
