import angular from 'angular';
import { inject, controller } from 'ng-annotations';
import Common from '../../services/common';
import Main from '../../services/main';
import Storage from '../../services/storage';
import User from '../../services/user';
import Backup from '../../services/backup';

@controller()
@inject('$scope', '$rootScope', '$location', Storage, Main, User, Common, Backup)
export default class MainController {
  constructor($scope, $rootScope, $location, Storage, Main, User, Common, Backup) {
    this.Main = Main;
    this.User = User;
    this.Common = Common;
    this.Backup = Backup;
    this.scope = $scope;
    this.Storage = Storage;
    this.rootScope = $rootScope;
    this.location = $location;
    /**
     * Set the token globaly
     */
    this.rootScope.Token = this.Storage.getToken();
    /**
     * Clean exit
     */
    this.scope.$on('$destroy', (event) => this.Main.clearListeners());
  }

  Login(user) {
    this.User.Login(user, (error, resUser) => {
      if (typeof resUser !== 'null') {
        $scope.user = '';
        Storage.setToken(resUser.Token);
        $location.path('/');
      }
    });
  }

  CreateUser(user){
    user._id = Common.newID();
    user.Permissions = { "Administrador": true }; // TEST ONLY
    
    this.User.CreateUser(user, (error, resUser) => {
      if (typeof resUser !== 'null' && typeof error === 'null') {
        Storage.setToken(resUser.Token);
        $location.path('/');
      }
    });
  }

  Logout() {
    this.User.Logout();
    Storage.deleteToken(); //Deberia ir en users
    $location.path('/');
  }

  getBackups() {
    Backup.getAll((e, backups) => {
      $scope.currentBackups = backups;
    });
  }
}
