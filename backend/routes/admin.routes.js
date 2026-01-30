const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getAllUsers);
router.put('/tickets/:id/approve', adminController.approveTicket);

module.exports = router;
