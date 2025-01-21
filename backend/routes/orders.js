const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Item = require('../models/Item');
const protect = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

const hashOTP = async (otp) => {
    const saltRounds = 5;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    return hashedOTP;
};

async function prehashOTP(otp) {
    // Convert the OTP string to a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(otp);

    // Hash the OTP using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex.toString();
}


// Create new order
router.post('/', protect, async (req, res) => {
    try {
        const { items } = req.body;
        const buyerId = req.user.id;

        // Fetch full item details
        const itemDetails = await Item.find({ _id: { $in: items } })
            .populate('sellerId', 'fullName');

        // Group items by seller
        const sellerGroups = itemDetails.reduce((acc, item) => {
            const sellerId = item.sellerId._id.toString();
            if (!acc[sellerId]) {
                acc[sellerId] = [];
            }
            acc[sellerId].push(item);
            return acc;
        }, {});

        const orderItems = itemDetails.map(item => ({
            itemId: item._id,
            name: item.name,
            price: item.price,
            sellerId: item.sellerId._id
        }));

        const totalAmount = orderItems.reduce((sum, item) => sum + item.price, 0);

        const order = new Order({
            items: orderItems,
            buyerId,
            totalAmount,
            sellerOTPs: []
        });

        await order.save();

        // Clear user's cart
        const user = await User.findById(buyerId);
        user.cartItems = [];
        await user.save();

        res.status(201).json({
            message: 'Order created successfully',
            order: {
                ...order.toObject(),
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Save the generated OTP for a seller
router.post('/generate-otp', async (req, res) => {
    const { orderId, sellerId, otp } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Hash the OTP
        const hashedOTP = await hashOTP(otp);

        // Find the seller's OTP entry or create a new one
        const sellerOTPIndex = order.sellerOTPs.findIndex(
            so => so.sellerId.toString() === sellerId
        );

        if (sellerOTPIndex === -1) {
            // Add new OTP entry
            order.sellerOTPs.push({
                sellerId,
                otp: hashedOTP,
                status: 'pending'
            });
        } else {
            // Update existing OTP
            order.sellerOTPs[sellerOTPIndex].otp = hashedOTP;
        }

        await order.save();

        res.status(200).json({ message: 'OTP saved successfully' });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ message: 'Failed to save OTP' });
    }
});


// Verify OTP and complete order for a specific seller
router.post('/verify-otp', protect, async (req, res) => {
    try {
        const { orderId, otp } = req.body;
        const sellerId = req.user.id;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Find the seller's OTP entry
        const sellerOTP = order.sellerOTPs.find(
            so => so.sellerId.toString() === sellerId.toString()
        );

        if (!sellerOTP) {
            return res.status(404).json({ message: 'Seller OTP not found or already used' });
        }

        // Pre-hash the input OTP
        const prehashedOTP = await prehashOTP(otp);

        // Verify OTP
        const isValidOTP = await bcrypt.compare(prehashedOTP, sellerOTP.otp);

        if (!isValidOTP) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Mark this seller's items as completed
        sellerOTP.status = 'completed';

        // Check if all sellers have completed their deliveries
        const allCompleted = order.sellerOTPs.every(so => so.status === 'completed');
        if (allCompleted) {
            order.status = 'completed';
        }

        await order.save();

        // Delete the items from the Items collection
        for (const item of order.items) {
            await Item.findByIdAndDelete(item.itemId);
        }

        res.json({
            message: 'Order updated successfully',
            status: order.status
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.error(error);
    }
});



// Get buyer's orders
router.get('/my-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ buyerId: req.user.id })
            .populate('items.itemId')
            .populate('items.sellerId', 'fullName')
            .sort('-createdAt');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

});

// Get seller's pending deliveries
router.get('/pending-deliveries', protect, async (req, res) => {
    try {
        const orders = await Order.find({
            'items.sellerId': req.user.id,
            status: 'pending'
        })
            .populate('buyerId', 'fullName email contactNumber')
            .sort('-createdAt');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch both purchases and sales in parallel for better performance
router.get('/user-history', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        const [purchases, sales] = await Promise.all([
            // Find orders where user is buyer
            Order.find({
                buyerId: userId,
                status: 'completed'
            })
                .populate('items.itemId')
                .populate('items.sellerId', 'fullName')
                .sort('-createdAt')
                .lean(),

            // Find orders where user is seller
            Order.find({
                'items.sellerId': userId,
                status: 'completed'
            })
                .populate('buyerId', 'fullName email')
                .populate('items.itemId')
                .sort('-createdAt')
                .lean()
        ]);

        // For sales, filter out items not sold by this user
        const processedSales = sales.map(order => ({
            ...order,
            items: order.items.filter(item =>
                item.sellerId.toString() === userId.toString()
            ),
            // Recalculate total amount for seller's items only
            totalAmount: order.items
                .filter(item => item.sellerId.toString() === userId.toString())
                .reduce((sum, item) => sum + item.price, 0)
        }));

        res.json({
            purchases,
            sales: processedSales
        });
    } catch (error) {
        console.error('Error fetching user history:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;