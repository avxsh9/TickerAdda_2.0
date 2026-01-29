const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['open', 'resolved', 'closed'], default: 'open' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dispute', DisputeSchema);
