const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

// Get reviews for a specific user
router.get('/user', auth, async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user.id })
            .populate('user', 'fullName')  // Populate user details
            .sort({ createdAt: -1 });      // Sort by newest first

        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new review
router.post('/:userId', auth, async (req, res) => {
    try {
        const { rating, comment, serviceType } = req.body;
        const targetUser = await User.findById(req.params.userId);

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const review = new Review({
            user: req.user.id,  // reviewer's ID
            targetUser: req.params.userId,  // reviewed user's ID
            rating,
            comment,
        });

        await review.save();

        // Update user's average rating
        const userReviews = await Review.find({ targetUser: req.params.userId });
        const avgRating = userReviews.reduce((acc, curr) => acc + curr.rating, 0) / userReviews.length;

        targetUser.rating = avgRating;
        await targetUser.save();

        // Populate the review with user details before sending response
        await review.populate('user', 'fullName');

        res.json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a review
router.put('/:reviewId', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user owns this review
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        await review.save();

        // Update user's average rating
        const userReviews = await Review.find({ targetUser: review.targetUser });
        const avgRating = userReviews.reduce((acc, curr) => acc + curr.rating, 0) / userReviews.length;

        const targetUser = await User.findById(review.targetUser);
        targetUser.rating = avgRating;
        await targetUser.save();

        res.json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a review
router.delete('/:reviewId', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Check if the user owns this review
        if (review.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await review.remove();

        // Update user's average rating
        const userReviews = await Review.find({ targetUser: review.targetUser });
        const avgRating = userReviews.length > 0
            ? userReviews.reduce((acc, curr) => acc + curr.rating, 0) / userReviews.length
            : 0;

        const targetUser = await User.findById(review.targetUser);
        targetUser.rating = avgRating;
        await targetUser.save();

        res.json({ message: 'Review removed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;