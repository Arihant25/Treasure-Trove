const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item');
const protect = require('../middleware/authMiddleware');

// Add item to cart
router.post('/add', protect, async (req, res) => {
    try {
        const { id: itemId } = req.body;

        // Verify the item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Verify user is different from seller
        if (item.sellerId.toString() === req.user.id) {
            return res.status(418).json({ message: 'Trying to buy your own goods?' });
        }

        // Get user and add item to their cart
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if item is already in cart
        if (user.cartItems.includes(itemId)) {
            return res.status(400).json({ message: 'Item already in cart' });
        }

        // Add item to cart
        user.cartItems.push(itemId);
        await user.save();

        res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get cart items
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate({
                path: 'cartItems',
                populate: {
                    path: 'sellerId',   // Populate the seller field inside each cartItem
                    select: 'fullName'  // Select only the name field
                }
            });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user.cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Remove item from cart
router.delete('/remove/:itemId', protect, async (req, res) => {
    try {
        const { itemId } = req.params;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove item from cart
        user.cartItems = user.cartItems.filter(item => item.toString() !== itemId);
        await user.save();

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;