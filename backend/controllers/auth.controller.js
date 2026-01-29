exports.register = async (req, res) => {
    res.json({ msg: 'Register user' });
};

exports.login = async (req, res) => {
    res.json({ msg: 'Login user' });
};

exports.getMe = async (req, res) => {
    res.json({ msg: 'Get current user' });
};
