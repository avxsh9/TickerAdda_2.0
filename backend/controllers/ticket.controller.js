exports.createTicket = async (req, res) => {
    res.json({ msg: 'List new ticket for sale' });
};

exports.getTicketsForEvent = async (req, res) => {
    res.json({ msg: 'Get tickets for event' });
};
