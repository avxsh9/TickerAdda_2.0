const mongoose = require('mongoose');

const connectDB = async () => {
    const connectDB = async () => {
        try {
            const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tickeradda';
            await mongoose.connect(dbURI);
            console.log('MongoDB Connected...');
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    };

    module.exports = connectDB;
