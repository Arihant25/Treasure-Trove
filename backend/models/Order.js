const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    items: [{
        itemId: {
            type: Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        name: String,
        price: Number,
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    }],
    buyerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    sellerOTPs: [{
        sellerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        otp: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Add indexes for better query performance
orderSchema.index({ buyerId: 1 });
orderSchema.index({ 'items.sellerId': 1 });

module.exports = mongoose.model('Order', orderSchema);