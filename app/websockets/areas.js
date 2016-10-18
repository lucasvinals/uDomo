let Areas   = require('../models/areas');
var log     = log || process.log;

module.exports = (io) => {
    /*************************************** Get Areas ***************************************************/
    io.on('connection', (socket) => {
        socket.on('Areas/Area/Read/Request', () => {
            Areas.find({}, (error, areas) => {
                /* Emit all areas and errors */
                io.sockets.emit('Areas/Area/Read/Response', {"Error": error, "Areas": areas});
            });
        });
    });
    /****************************************************************************************************/
};