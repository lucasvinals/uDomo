var log     = log || process.log;
let Devices = require('../models/devices');
let Common  = require('../common');

module.exports = (io) => {
    'use strict';
    
    io.on('connection', (socket) => {
        socket.on('deviceRequest', (device) => {
            device.Online = true;
            device.lastMessage = Date.now();
            io.sockets.emit('devices', Common.mergeDevice(device));
        });
        socket.on('rChangePin', (r) => {
            try {
                var json = {};
                switch(r.mode){
                    case 'digital':
                        r.value = r.value == 0 ? 1023 : 0;
                    break;
                    case 'analog':
                        if(r.value < 0 || r.value > 1023){
                            throw 'The value has to be between 0 and 1023';
                        }
                    break;
                }
                var type = r.mode;
                delete r.mode;
                json[type] = r;
                socket.broadcast.emit('changePin', json);
            } catch (e){
                log.error('Something happened trying to send the message to the device', e);
            }
        });
        
        socket.on('disconnect', () => {
            socket = null;
        });
    });
};