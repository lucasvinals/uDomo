import Socket from '../socket';

module.exports = angular.module('uDomo.Main').factory(
  'MainFactory',
  [ () => Object.assign(
    {
      clearListeners: () => {
        Socket.clear('Main/User/SignIn/Response');
        Socket.clear('Main/User/Create/Response');
        Socket.emit('disconnect', {});
      },
    }),
  ]
);
