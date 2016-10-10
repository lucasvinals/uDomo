let Main = angular.module('Main', []);

Main.factory('Main', ['Socket', (Socket) => {
	'use strict';
	return {
            clearListeners: () => {
                Socket.clear('Main/User/SignIn/Response');
        		Socket.clear('Main/User/Create/Response');
        		Socket.emit('disconnect', {});
            }
	}
}]);