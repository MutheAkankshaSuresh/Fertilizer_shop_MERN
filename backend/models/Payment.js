const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true },  // Razorpay order ID
    paymentId: { type: String, required: true }, // Razorpay payment ID
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, default: "success" },
    paymentMethod: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);
