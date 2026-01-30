const express = require('express');
require('dotenv').config(); // Load env vars
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/public', express.static(path.join(__dirname, '../frontend/public')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
// Fix: uploads is in root, so use ../uploads relative to backend/server.js
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/tickets', require('./routes/ticket.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/payment', require('./routes/payment.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

// Specific Route for Home Page (Explicit)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/public/index.html'));
});

// Fallback to index.html for any other route (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/public/index.html'));
});

// Connect Database
const connectDB = require('./config/db');
connectDB().then(() => {
    seedAdmin();
});

// Seed Admin User
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    try {
        const adminEmail = 'admin@ticketadda.in';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log('Admin user not found. Creating...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Avi@98711', salt);

            const newAdmin = new User({
                name: 'Avinash',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                phone: '9999999999' // Dummy phone
            });

            await newAdmin.save();
            console.log('✅ Admin User Created Successfully: admin@ticketadda.in');
        } else {
            console.log('ℹ️ Admin User already exists.');
        }
    } catch (err) {
        console.error('❌ Error seeding admin:', err);
    }
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
