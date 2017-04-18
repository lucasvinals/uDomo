import Socket from '../socket';

function MainFactory() {
  return {
    clearListeners: () => {
      Socket.clear('Main/User/SignIn/Response');
      Socket.clear('Main/User/Create/Response');
      Socket.emit('disconnect', {});
    },
  };
}

export default angular.module('uDomo.Main').factory('MainFactory', MainFactory);
