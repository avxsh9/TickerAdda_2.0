const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tickeradda');
        console.log('MongoDB Connected...');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Avi@98711', salt);

        const admin = new User({
            name: 'Super Admin',
            email: 'admin@ticketadda.in',
            password: hashedPassword,
            phone: '+910000000000',
            role: 'admin'
        });

        await admin.save();
        console.log('Super Admin Created: admin@ticketadda.in');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
