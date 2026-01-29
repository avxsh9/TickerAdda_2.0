const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.get('/', userController.getAllUsers);

module.exports = router;
