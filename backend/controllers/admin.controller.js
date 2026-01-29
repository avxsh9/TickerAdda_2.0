exports.getAllUsers = async (req, res) => {
    res.json({ msg: 'Get all users (admin)' });
};

exports.approveTicket = async (req, res) => {
    res.json({ msg: 'Approve ticket' });
};
