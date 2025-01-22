const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('MongoDB Connected...');
        })
        .catch((err) => {
            console.error(`Error: ${err.message}`);
            process.exit(1);
        });
};

module.exports = connectDB;
