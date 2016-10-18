var User = require('../models/users');
var log     = log || process.log;

module.exports = (io, log) => {
    io.on('connection', (socket) => {
        socket.on('Users/User/Read/Request', () => {
            User.find({}, (error, users) => {
                io.sockets.emit('Users/User/Read/Response', {"Error": error, "Users": users});
            });
        });
    });
};