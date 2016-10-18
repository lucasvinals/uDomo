//var serverCode      = require('../../config/sensors').jsDummy;
//var serverSensor    = require(serverCode.dir + serverCode.fileName + serverCode.extension);
//
//var pythonShell     = require('python-shell');
//var sensor          = new pythonShell(   serverCode.dir + 
//                                        serverCode.fileName + 
//                                        serverCode.extension, 
//                                        {mode: 'json'}
//);
module.exports = (io) => {
//    sensor.on('message', function (data){
//            io.sockets.emit('serverSensor', data);
//    });
    'use strict';
    /***************************************** User/device is now connected **********************************************/
    io.on('connection', (socket) => {
      
        /****************************************** Device's incomming message *******************************************/
        // socket.on('bufferLoop', function (message) {
        //     socket.broadcast.emit('clientDeviceRequest', message);
        // });
        /*****************************************************************************************************************/
        
        /*********************************************** Message to device ***********************************************/
        // socket.on('clientChangePin', function(json){
        //     try {
        //         console.log('Intentando enviar' + JSON.stringify(json));
        //         socket.broadcast.emit('deviceChangePin', {device: json});
        //     } catch (e){
        //         console.log('Something happened trying to send the message to the device', e);
        //     }
        // });
        /*****************************************************************************************************************/
        
        /**************************************** User/device is nowdisconnected *****************************************/
        socket.on('disconnect', ()  => {
            socket = null;
        });
        /*****************************************************************************************************************/
    });
    /*********************************************************************************************************************/
};