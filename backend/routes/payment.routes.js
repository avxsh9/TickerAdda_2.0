const express = require('express');
const router = express.Router();
// Placeholder controller ref
// const paymentController = require('../controllers/payment.controller');

router.post('/create-order', (req, res) => res.json({ msg: 'Create Razorpay Order' }));
router.post('/verify', (req, res) => res.json({ msg: 'Verify Payment' }));

module.exports = router;
