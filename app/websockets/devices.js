var log     = log || process.log;
let Devices = require('../models/devices');
let Common  = require('../common');

// let allDevices = [];

/**
 * Otra forma de actualizar el arreglo
 */
// a.map((e, i) => {
//     if(a.some((f) => f.id == 8)){
//        a[i] = {"a": 33, "id": 11};
//     }
// });

// function updateOneDevice(dev){
//     allDevices = allDevices.filter((d) => d._id !== dev._id);
//     allDevices.push(dev);
// };

// function mergeDevices(device){
//     allDevices.some((d) => d._id == device._id) ? updateOneDevice(device) : allDevices.push(device);
// };

module.exports = (io) => {
    'use strict';
    
    io.on('connection', (socket) => {
        socket.on('deviceRequest', (device) => {
            device.Online = true;
            device.lastMessage = Date.now();
            io.sockets.emit('devices', Common.mergeDevices(device));
        });
        
        socket.on('rChangePin', (json) => {
            try {
                switch(json.mode){
                    case 'digital':
                        json.value = json.value == 0 ? 1023 : 0;
                    break;
                    case 'analog':
                        if(json.value < 0 || json.value > 1023){
                            throw 'The value has to be between 0 and 1023';
                        }
                    break;
                }
                socket.broadcast.emit('changePin', {device: json});
            } catch (e){
                log.error('Something happened trying to send the message to the device', e);
            }
        });
        
        socket.on('disconnect', () => {
            socket = null;
        });
    });
};