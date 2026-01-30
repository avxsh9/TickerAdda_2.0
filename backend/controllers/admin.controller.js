const User = require('../models/User');
const Ticket = require('../models/Ticket');

exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        // Active Events (Approved Tickets)
        const activeEvents = await Ticket.countDocuments({ status: 'approved' });

        // Total Sales (Sum of price of sold tickets)
        const soldTickets = await Ticket.find({ status: 'sold' });
        const totalSales = soldTickets.reduce((acc, ticket) => acc + ticket.price, 0);

        res.json({
            totalUsers,
            activeEvents,
            totalSales
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.approveTicket = async (req, res) => {
    // This logic is likely handled in ticket.controller.js as updateStatus, 
    // but if specific admin approval logic is needed, add here.
    // For now, let's keep it unused or simple.
    res.json({ msg: 'Use ticket controller for approval' });
};
