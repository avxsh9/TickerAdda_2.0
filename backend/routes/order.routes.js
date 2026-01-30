const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

const auth = require('../middleware/auth.middleware');

router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getMyOrders);

module.exports = router;
