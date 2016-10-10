module.exports = (io, log) => {
    'use strict';
    const time1 = Date.now();
    /***************************************** User/device is now connected **********************************************/
    io.on('connection', (socket) => {
        /* WS request devices */
        socket.on('requestStoredDevices', () => {
            /* Find all devices stored in the database */
            require('../models/devices').find({}, (error, devices) => {
                io.sockets.emit('dbStoredDevices', {"Error": error, "Devices": devices});
            });
        });

        /****************************************** Device's incomming message *******************************************/
        socket.on('bufferLoop', (device) => {
            device.Online = true;
            device.lastMessage = Date.now();
            //log.info('Nuevo mensaje a los ' + (Date.now() - time1)/1000 + ' segundos de iniciado.');
            io.sockets.emit('onlineDevice', device);
        });
        /*****************************************************************************************************************/
        
        /*********************************************** Message to device ***********************************************/
        socket.on('clientChangePin', (json) => {
            try {
                socket.broadcast.emit('deviceChangePin', {device: json});
            } catch (e){
                log.error('Something happened trying to send the message to the device', e);
            }
        });
        /*****************************************************************************************************************/
        
        /**************************************** User/device is nowdisconnected *****************************************/
        socket.on('disconnect', () => {
            socket = null;
        });
        /*****************************************************************************************************************/
    });
    /*********************************************************************************************************************/
};