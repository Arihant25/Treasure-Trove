const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');

// Load environment variables
require('dotenv').config();

// Connect to the database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Treasure Trove backend is running'));
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
