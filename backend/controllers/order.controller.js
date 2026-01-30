const Order = require('../models/Order');
const Ticket = require('../models/Ticket');

// @desc    Create a new order (Buy Ticket)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const { ticketId } = req.body;

        // 1. Find the ticket and populate seller to return contact info later
        const ticket = await Ticket.findById(ticketId).populate('seller', 'name email phone');
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        // 2. Check if available
        if (ticket.status !== 'approved') {
            return res.status(400).json({ msg: 'Ticket is not available for sale' });
        }

        // 3. Create Order
        const order = new Order({
            buyer: req.user.id,
            ticket: ticketId,
            totalAmount: ticket.price,
            status: 'completed'
        });

        await order.save();

        // 4. Mark Ticket as Sold
        ticket.status = 'sold';
        await ticket.save();

        res.json({
            msg: 'Ticket purchased successfully!',
            orderId: order._id,
            seller: {
                name: ticket.seller.name,
                email: ticket.seller.email,
                phone: ticket.seller.phone
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get my orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user.id })
            .populate({
                path: 'ticket',
                populate: { path: 'seller', select: 'name email phone' }
            })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
