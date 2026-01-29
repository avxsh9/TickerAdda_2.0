const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public Route
router.get('/approved', ticketController.getApprovedTickets);

// Protected Routes
router.post('/', [auth, upload.single('ticketFile')], ticketController.createTicket);
router.get('/my-tickets', auth, ticketController.getMyTickets);
router.get('/pending', auth, ticketController.getPendingTickets); // Needs Admin check ideally, but auth is first step
router.get('/history', auth, ticketController.getTicketHistory);
router.get('/stats', auth, ticketController.getStats);
router.put('/:id/status', auth, ticketController.updateTicketStatus);

module.exports = router;
