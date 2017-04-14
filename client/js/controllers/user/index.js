import User from '../../services/user';
// import Common from '../../services/common';

function userController($scope) {
  /**
   * Init object for buttons
   */
  $scope.conf = {
    'Security': false,
    'Scenes': false,
    'Readings': false,
    'Devices': false,
    'Users': false,
  };

  /**
   * Read User
   */
  const getUsers = (function iifeGetUsers() {
    User
      .GetUsers()
      .then((users) => {
        $scope.users = users;
      });
    return iifeGetUsers;
  }());

  /**
   * Observer pattern
   */
  User.Subscribe(getUsers);

  /**
   * Remove User
   */
  $scope.removeUser = (id) => {
    User.DeleteUser(id);
  };

  /**
   * Modify User
   */
  $scope.modifyUser = (user) => {
    User.ModifyUser(user);
  };

  /**
   * Clean exit
   */
  $scope.$on('$destroy', () => {
    User.clearListeners();
  });

  // $scope.canRemove = () => $rootScope.currentUser.Administrator;

  /**
   * Get Permissions
   */
  const getPermissions = (function iifePermissions() {
    User.GetPermissions((error, permissions) => {
        $scope.permissions = permissions;
      });
    return iifePermissions;
  }());

  /**
   * Get Configurations
   */
  const getConfigurations = (function iifeConfigurations() {
    User
      .GetConfigurations()
      .then((configurations) => {
        $scope.configurations = configurations;
      });
    return iifeConfigurations;
  }());

  // $scope.createConfiguration = (c) => {
  //   c._id = Common.newID();
  //   User.CreateConfiguration(c, (e, success) => {
  //       e &&
  //         log.error('Ocurrió un error creando la configuración') ||
  //         log.success('Se creó la configuración.');
  //     });
  // };
}

module.exports = angular
  .module('uDomo.User')
  .controller('userController', [ '$scope', userController ]);
