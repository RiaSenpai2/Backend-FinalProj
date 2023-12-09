// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderCreationId: String,
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    amount: Number,
    currency: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
    // Add any other relevant fields
});

module.exports = mongoose.model('Order', OrderSchema);
