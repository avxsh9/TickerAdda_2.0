const Ticket = require('../models/ticket.model');

// @desc    Create a new ticket listing
// @route   POST /api/tickets
// @access  Private (Seller/Admin)
// @desc    Create a new ticket listing
// @route   POST /api/tickets
// @access  Private (Seller/Admin)
exports.createTicket = async (req, res) => {
    try {
        const { event, category, seat, quantity, price } = req.body;

        let fileUrl = 'mock-ticket-file.pdf'; // Default fallback
        if (req.file) {
            fileUrl = req.file.path; // e.g., uploads/ticketFile-12345.pdf
        }

        const ticket = new Ticket({
            seller: req.user.id,
            event,
            category,
            seat,
            quantity,
            price,
            fileUrl: fileUrl,
            status: 'pending'
        });

        await ticket.save();
        res.json(ticket);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all pending tickets for admin approval
// @route   GET /api/tickets/pending
// @access  Private (Admin)
exports.getPendingTickets = async (req, res) => {
    try {
        // Populate seller details to show who sold it
        const tickets = await Ticket.find({ status: 'pending' }).populate('seller', 'name email');
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Approve or Reject a ticket
// @route   PUT /api/tickets/:id/status
// @access  Private (Admin)
exports.updateTicketStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'

        let ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ msg: 'Ticket not found' });

        ticket.status = status;
        await ticket.save();

        res.json(ticket);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all approved tickets (Public)
// @route   GET /api/tickets/approved
// @access  Public
exports.getApprovedTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ status: 'approved' });
        res.json(tickets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
