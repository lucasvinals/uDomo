const { log } = process;
const { merge, get, find, unset } = require('lodash');

module.exports = (wsServer) => {
  const wsDevice = wsServer('device');
  wsDevice.Socket.on('message', console.log);
  // io.on('connection', (socket) => {
  //   socket.on('deviceRequest', (device) => {
  //     /**
  //      * Since the device is now online,
  //      * set Online and lastMessage accordingly
  //      */
  //     merge(device, { Online: true, lastMessage: Date.now() });

  //     /**
  //      * Merge the device into process.devices
  //      */
  //     merge(
  //       find(process.devices, { _id: get(device, '_id', null) }),
  //       device
  //     );
  //     io.sockets.emit('devices', process.devices);
  //   });
  //   socket.on('rChangePin', (request) => {
  //     try {
  //       const MAX = 1023;
  //       switch (request.mode) {
  //         case 'digital':
  //           request.value = request.value === 0 ? MAX : 0;
  //           break;
  //         case 'analog':
  //           if (request.value < 0 || request.value > MAX) {
  //             throw new Error('The value has to be between 0 and 1023');
  //           }
  //           break;
  //         default:
  //           break;
  //       }
  //       socket.broadcast.emit('changePin', unset(request, 'mode'));
  //     } catch (changePinError) {
  //       log.error('Something happened trying to send the message to the device', changePinError);
  //     }
  //   });

  //   socket.on('disconnect', () => {
  //     socket = null;
  //   });
  // });
};
