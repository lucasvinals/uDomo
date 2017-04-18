import io from 'socket.io-client';

function SocketFactory($rootScope) {
  const socketURL = (location.protocol.slice(0, Number('-1')) === 'https' ? 'wss://' : 'ws://') + location.host;
  const socketOptions = {
    forceNew: true,
    reconnect: true,
    reconnectionDelay: 400,
  };
  const socket = io.connect(socketURL, socketOptions);

  return {
    on: (eventName, response) => {
      socket.on(eventName, (...args) => $rootScope.$apply(() => response.apply(socket, args)));
    },
    emit: (eventName, dataToSend, response) =>
      socket.emit(eventName, dataToSend, (...args) =>
        $rootScope.$apply(() => response && response.apply(socket, args))
      ),
    clear: (eventName) => socket.off(eventName),
    cleanExit: () => socket.close(),
  };
}

export default angular.module('uDomo.Common').factory('SocketFactory', [ '$rootScope', SocketFactory ]);
