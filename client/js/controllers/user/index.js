import { controller, inject } from 'ng-annotations';

@controller('ControllerUser')
@inject('FactoryUser', '$scope')
export default class {
  constructor(User, scope) {
    this.scope = scope;
    this.User = User;
    this.conf = {
      'Security': false,
      'Scenes': false,
      'Readings': false,
      'Devices': false,
      'Users': false,
    };
    this.GetUsers();
    this.User.Subscribe(this.GetUsers);
  }

  GetUsers() {
    return this.User
      .GetUsers()
      .then((users) => {
        this.users = users;
      });
  }

  DeleteUser(id) {
    return this.User.DeleteUser(id);
  }

  ModifyUser(user) {
    return this.User.ModifyUser(user);
  }

  ClearListeners() {
    this.scope.$on('$destroy', () => this.User.ClearListeners());
  }

  GetPermissions() {
    return this.User.GetPermissions((errorCB, permissions) => {
      this.permissions = permissions;
    });
  }

  GetConfigurations() {
    return this.User
      .GetConfigurations()
      .then((configurations) => {
        this.configurations = configurations;
      });
  }
}
