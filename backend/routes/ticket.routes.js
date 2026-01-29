const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

router.post('/', ticketController.createTicket);
router.get('/event/:eventId', ticketController.getTicketsForEvent);

module.exports = router;
