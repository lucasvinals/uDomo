import Common from '../../services/common';
import Main from '../../services/main';
import Storage from '../../services/storage';
import User from '../../services/user';
import Backup from '../../services/backup';

function mainController($scope, $rootScope, $location) {
  $scope.Login = (user) => {
    User.Login(user, (error, resUser) => {
      if (typeof resUser !== 'null') {
        $scope.user = '';
        Storage.setToken(resUser.Token);
        $location.path('/');
      }
    });
  };

  $scope.CreateUser = (user) => {
    user._id = Common.newID();
    user.Permissions = { "Administrador": true }; // TEST ONLY
    
    User.CreateUser(user, (error, resUser) => {
      if (typeof resUser !== 'null' && typeof error === 'null') {
        Storage.setToken(resUser.Token);
        $location.path('/');
      }
    });
  };

  $scope.Logout = () => {
    User.Logout();
    Storage.deleteToken(); //Deberia ir en users
    $location.path('/');
  };

  $rootScope.Token = Storage.getToken();


  $scope.getBackups = () => {
    Backup.getAll((e, backups) => {
      $scope.currentBackups = backups;
    });
  };

  /* Clean exit */
  $scope.$on('$destroy', (event) => {
    Main.clearListeners();
  });
}

module.exports = angular
  .module('uDomo.Main')
  .controller('mainController', [ '$scope', '$rootScope', '$location', mainController ]);
