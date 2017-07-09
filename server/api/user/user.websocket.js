const User = require('./user.model');

module.exports = (io) =>
  io.on('connection', (socket) => {
    /**
     * Get all users
     */
    socket.on('Users/User/Read/Request', () =>
      User
        .find()
        .exec()
        .then((Users) => io.sockets.emit('Users/User/Read//Response', { Error: null, Users }))
        .catch((findError) => io.sockets.emit('Users/User/Read/Response', { Error: findError, Users: [] }))
    );
  });
