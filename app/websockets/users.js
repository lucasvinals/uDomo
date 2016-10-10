var User = require('../models/users');

module.exports = (io, log) => {
    io.on('connection', (socket) => {
        socket.on('Users/User/Read/Request', () => { // WS get users
            User.find({}, (error, users) => {
                io.sockets.emit('Users/User/Read/Response', {"Error": error, "Users": users});
            });
        });
    });
};