const mongoose = require('mongoose');

const uri = "mongodb+srv://ticketaddain_db_user:Avi98711@cluster0.bnaasft.mongodb.net/tickeradda?retryWrites=true&w=majority";

const testConnection = async () => {
    try {
        console.log("Attempting to connect to MongoDB Atlas...");
        await mongoose.connect(uri);
        console.log("✅ SUCCESS! Connected to MongoDB Atlas.");
        process.exit(0);
    } catch (err) {
        console.error("❌ CONNECTION FAILED:", err.message);
        process.exit(1);
    }
};

testConnection();
