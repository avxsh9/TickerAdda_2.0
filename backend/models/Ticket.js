const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    section: { type: String },
    row: { type: String },
    seat: { type: String },
    status: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', TicketSchema);
