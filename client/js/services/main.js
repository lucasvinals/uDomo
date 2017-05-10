const Main = angular.module('Main', []);

Main.factory('Main', ['Socket', (Socket) => {
	'use strict';
	let Facade = {
            clearListeners: () => {
                Socket.clear('Main/User/SignIn/Response');
        		Socket.clear('Main/User/Create/Response');
        		Socket.emit('disconnect', {});
            }
	};
	return Facade;
}]);