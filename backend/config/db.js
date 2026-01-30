const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("🔍 DEBUG: Checking Environment Variables...");
        if (!process.env.MONGO_URI) {
            console.error("❌ CRITICAL ERROR: 'MONGO_URI' is NOT found in environment variables! Using localhost (which will fail).");
        } else {
            console.log("✅ SUCCESS: 'MONGO_URI' found. Attempting connection...");
        }

        const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tickeradda';
        await mongoose.connect(dbURI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
