const mongoose = require('mongoose');
const Ticket = require('./backend/models/ticket.model');

mongoose.connect('mongodb://localhost:27017/tickeradda')
    .then(async () => {
        console.log('Connected to DB');
        const tickets = await Ticket.find().sort({ createdAt: -1 }).limit(3);
        console.log('Latest 3 Tickets:');
        tickets.forEach(t => {
            console.log(`- ID: ${t._id}, Event: ${t.event}, File: ${t.fileUrl}`);
        });
        mongoose.connection.close();
    })
    .catch(err => console.error(err));
