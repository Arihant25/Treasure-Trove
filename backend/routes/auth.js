const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
    const { fullName, email, age, contactNumber, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with a salt round of 10
        const user = new User({
            fullName,
            email,
            age,
            contactNumber,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Profile route (protected)
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Get user info without password
        res.json(user);  // Send user data as response
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Update age
router.put('/update/age', protect, async (req, res) => {
    try {
        const { age } = req.body;

        if (!age || !Number.isInteger(age) || age <= 0) {
            return res.status(400).json({ message: 'Invalid age.' });
        }

        await User.findByIdAndUpdate(req.user.id, { age });
        res.json({ message: 'Age updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update contact number
router.put('/update/contactNumber', protect, async (req, res) => {
    try {
        const { contactNumber } = req.body;

        if (!contactNumber) {
            return res.status(400).json({ message: 'Contact number is required' });
        }

        await User.findByIdAndUpdate(req.user.id, { contactNumber });
        res.json({ message: 'Contact number updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update password
router.put('/update/password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Find user
        const user = await User.findById(req.user.id);

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
