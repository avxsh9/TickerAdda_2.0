const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);
router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateUserRole);

module.exports = router;
