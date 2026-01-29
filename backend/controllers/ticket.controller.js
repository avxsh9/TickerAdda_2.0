const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = async (req, res) => {
    try {
        const { event, date, time, venue, description, price, type, quantity, seat, row, category } = req.body;

        // Simple validation
        if (!event || !price || !quantity) {
            return res.status(400).json({ msg: 'Please enter all required fields' });
        }

        const ticket = new Ticket({
            seller: req.user.id,
            event,
            date,
            time,
            venue,
            description,
            price,
            type,
            quantity,
            seat,
            row,
            category,
            fileUrl: req.file ? req.file.path : null // Handle file upload
        });

        await ticket.save();
        res.json(ticket);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all tickets (Public - with filters)
// @route   GET /api/tickets/approved
// @access  Public
exports.getApprovedTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: 'approved' }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get pending tickets (Admin only)
// @route   GET /api/tickets/pending
// @access  Private (Admin)
exports.getPendingTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: 'pending' })
            .populate('seller', 'name email')
            .sort({ createdAt: 1 }); // Oldest first
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update ticket status (Admin only)
// @route   PUT /api/tickets/:id/status
// @access  Private (Admin)
exports.updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Find ticket
        let ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        ticket.status = status;
        await ticket.save();

        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get ticket history (Admin only)
// @route   GET /api/tickets/history
// @access  Private (Admin)
exports.getTicketHistory = async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: { $ne: 'pending' } })
            .populate('seller', 'name email')
            .sort({ updatedAt: -1 }); // Recently processed first
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get tickets for logged in seller
// @route   GET /api/tickets/my-tickets
// @access  Private (Seller)
exports.getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ seller: req.user.id }).sort({ createdAt: -1 });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get Admin Stats
// @route   GET /api/tickets/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
    try {
        const pendingCount = await Ticket.countDocuments({ status: 'pending' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const approvedTodayCount = await Ticket.countDocuments({
            status: 'approved',
            updatedAt: { $gte: today }
        });

        // Calculate Total Value (GMV) - Approved & Sold
        const processedTickets = await Ticket.find({ status: { $in: ['approved', 'sold'] } });
        const totalValue = processedTickets.reduce((acc, ticket) => acc + (ticket.price * ticket.quantity), 0);

        res.json({
            pending: pendingCount,
            approvedToday: approvedTodayCount,
            totalValue: totalValue
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
