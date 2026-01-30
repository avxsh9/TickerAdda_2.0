const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    res.json({ msg: 'Get user profile' });
};

exports.updateUserProfile = async (req, res) => {
    res.json({ msg: 'Update user profile' });
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.role = req.body.role || user.role;
        await user.save();

        res.json({ msg: 'User role updated', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
