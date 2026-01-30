const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    event: { type: String, required: true },
    type: { type: String, enum: ['music', 'sports', 'comedy', 'other'], default: 'other' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    section: { type: String },
    row: { type: String },
    seat: { type: String },
    fileUrl: { type: String }, // Path to uploaded proof
    status: { type: String, enum: ['available', 'sold', 'pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', TicketSchema);
