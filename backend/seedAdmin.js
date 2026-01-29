const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tickeradda');
        console.log('MongoDB Connected...');

        const email = 'admin@ticketadda.in';
        const password = 'Avi@98711';

        let user = await User.findOne({ email });
        if (user) {
            console.log('Admin user already exists');
            process.exit();
        }

        user = new User({
            name: 'Super Admin',
            email,
            password,
            role: 'admin'
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        console.log('Admin user created successfully');
        process.exit();

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
