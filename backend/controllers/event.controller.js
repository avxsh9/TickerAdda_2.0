exports.createEvent = async (req, res) => {
    res.json({ msg: 'Create new event' });
};

exports.getEvents = async (req, res) => {
    res.json({ msg: 'Get all events' });
};

exports.getEventById = async (req, res) => {
    res.json({ msg: 'Get event details' });
};
