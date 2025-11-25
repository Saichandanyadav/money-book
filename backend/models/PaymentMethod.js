const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    normalizedName: { type: String, required: true, trim: true, lowercase: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
});

PaymentMethodSchema.pre("save", function (next) {
    if (this.isModified("name") || this.isNew) {
        this.normalizedName = this.name.toLowerCase();
    }
    next();
});

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);