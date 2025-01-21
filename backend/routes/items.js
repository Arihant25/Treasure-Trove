const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const protect = require('../middleware/authMiddleware');

// Get all items with optional search and category filters
router.get('/', async (req, res) => {
    try {
        const { search, categories } = req.query;
        let query = {};

        // Case insensitive search on item name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Filter by categories if provided
        if (categories) {
            const categoryArray = categories.split(',');
            query.category = { $in: categoryArray };
        }

        // Get items with price between minPrice and maxPrice
        if (req.query.minPrice && req.query.maxPrice) {
            query.price = { $gte: req.query.minPrice, $lte: req.query.maxPrice };
        } else if (req.query.minPrice) {
            query.price = { $gte: req.query.minPrice };
        } else if (req.query.maxPrice) {
            query.price = { $lte: req.query.maxPrice };
        }

        const items = await Item.find(query).populate('sellerId', 'fullName email');
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single item by ID
router.get('/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('sellerId', 'fullName email');
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new item (protected route)
router.post('/', protect, async (req, res) => {
    try {
        const { name, price, description, image, category } = req.body;
        const item = new Item({
            name,
            price,
            description,
            image,
            category,
            sellerId: req.user.id
        });
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;