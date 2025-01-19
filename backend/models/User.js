const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    contactNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartItems: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Item'
        }
    ],
    sellerReviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
    ,
    isCAS: {
        type: Boolean,
        default: false
    }
});

module.exports = model('User', userSchema);
