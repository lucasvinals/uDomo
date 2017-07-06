const Zone = require('./zone.model');

module.exports = (io) => {
  /**
   * Get all zones
   */
  // io.on('connection', (socket) =>
  //   socket.on('Zones/Zone/Read/Request', () =>
  //     Zone
  //       .find()
  //       .exec()
  //       .then((Zones) => io.sockets.emit('Zones/Zone/Read/Response', { Error: null, Zones }))
  //       .catch((findError) => io.sockets.emit('Zones/Zone/Read/Response', { Error: findError, Zones: [] }))
  //   )
  // );
};
