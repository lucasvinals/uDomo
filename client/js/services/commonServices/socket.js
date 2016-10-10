let Sockets = angular.module('Common');

Sockets.factory('Socket', ['$rootScope', 
($rootScope) => {
    'use strict';
	let proto = location.protocol.slice(0, location.protocol.length - 1);
    let socketURL = proto === 'https' ? 'wss://' + location.host : 'ws://' + location.host;
    const socketOptions = {
        "force new connection": true,
        "reconnect" : true,
        "reconnection delay" : 500,
        "max reconnection attempts" : 20
    };
    let socket = io.connect(socketURL, socketOptions);
    
	return {
		on: (eventName, callback) => {
            socket.on(eventName, function(){  
                let args = arguments;
                $rootScope.$apply(() => {
                  callback.apply(socket, args);
                });
            });
		},
		emit: (eventName, data, callback) => {
            socket.emit(eventName, data, function(){
                let args = arguments;
                $rootScope.$apply(() => {
                  if (callback) {
                    callback.apply(socket, args);
                  }
                });
            });
		},
        clear: (eventName) => {
            socket.removeListener(eventName);
        },
        cleanExit: () => {
            socket.close();
        }
        //,
        //emitDevices: (eventName, data, cb) => {
        //    io.sockets.emit(eventName, data);
        //}
	};
}]);