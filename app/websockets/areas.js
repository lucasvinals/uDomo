module.exports = (io, log) => {
    /*************************************** Get Areas ***************************************************/
    io.on('connection', (socket) => {
        socket.on('Areas/Area/Read/Request', () => {
            /* Get all areas */
            require('../models/areas').find({}, (error, areas) => {
                /* Emit all areas and errors */
                io.sockets.emit('Areas/Area/Read/Response', {"Error": error, "Areas": areas});
            });
        });
    });
    /****************************************************************************************************/
};