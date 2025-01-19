const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    transactionId: {
        type: Number,
        required: true
    },
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    hashedOTP: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Order', orderSchema);
