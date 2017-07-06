
module.exports = (io) => {
//    sensor.on('message', function (data){
//            io.sockets.emit('serverSensor', data);
//    });
  // io.on('connection', (socket) => {
    /**
     * Device's incomming message
     */
    // socket.on('bufferLoop', function (message) {
    //     socket.broadcast.emit('clientDeviceRequest', message);
    // });
    /**
     * Message to device
     */
    // socket.on('clientChangePin', function(json){
    //     try {
    //         console.log('Intentando enviar' + JSON.stringify(json));
    //         socket.broadcast.emit('deviceChangePin', {device: json});
    //     } catch (e){
    //         console.log('Something happened trying to send the message to the device', e);
    //     }
    // });

  /**
   * User/device is nowdisconnected
   */
  //   socket.on('disconnect', () => {
  //     socket = null;
  //   });
  // });
};
