import { service, inject } from 'ng-annotations';

@service('FactoryUser')
@inject('$http', 'FactoryMessage', 'FactoryObserver', 'FactorySocket', 'FactoryStorage')
export default class {
  constructor(http, Message, Observer, Socket, Storage) {
    this.http = http;
    this.Message = Message;
    this.Observer = Observer;
    this.Socket = Socket;
    this.Storage = Storage;
    this.currentUser = this.GetUserFromToken();
  }

  GetUsers() {
    return this.http
      .get('/api/user')
      .then((users) => {
        const { Error: GetUsersError, Users } = users.data;
        if (GetUsersError) {
          this.Message.error('Ocurrió un error obteniendo los usuarios');
          window.log.error(JSON.stringify(GetUsersError));
          throw new Error('GetUsersError', JSON.stringify(GetUsersError));
        }
        return Users;
      })
      .catch((getError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error('HTTPRequestError', JSON.stringify(getError));
      });
  }

  CreateUser(user) {
    return this.http
      .post('/api/user', user)
      .then((createResult) => {
        const { ErrorCreated, UserCreated } = createResult.data;
        if (ErrorCreated) {
          this.Message.warning(JSON.stringify(ErrorCreated));
          throw new Error(ErrorCreated);
        }
        this.Message.success(`El usuario ${ UserCreated.Name } fue creado.`);
        this.Observer.Notify();
      })
      .catch((postError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error('HTTPRequestError', JSON.stringify(postError));
      });
  }

  ModifyUser(user) {
    return this.http
      .put('/api/user', user)
      .then((modifyResult) => {
        const { ErrorModifing, UserModified } = modifyResult.data;
        if (ErrorModifing) {
          this.Message.warning(ErrorModifing);
          throw new Error('ModifyUserError', ErrorModifing);
        }
        this.Message.success(`El usuario ${ UserModified.Name } fue modificado.`);
        this.Observer.Notify();
        return UserModified;
      })
      .catch((putError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error('HTTPRequestError', JSON.stringify(putError));
      });
  }

  DeleteUser(id) {
    return this.Message.confirm(
      'Desea eliminar el usuario?',
      Number('5'),
      (response) =>
        response && this.http
          .delete(`/api/user/${ id }`)
          .then((deletedResult) => {
            const { ok, 'n': NumberOfDeletes } = deletedResult.data.User;
            if (ok && NumberOfDeletes) {
              this.Message.success('El usuario fue eliminado.');
              this.Observer.Notify();
            }
            return id;
          })
          .catch((deleteError) => {
            this.Message.error('Ocurrió un error con la consulta http');
            throw new Error('HTTPRequestError', JSON.stringify(deleteError));
          })
    );
  }

  Subscribe(fn) {
    return this.Observer.Subscribe(fn);
  }

  Unsubscribe(fn) {
    return this.Observer.Unsubscribe(fn);
  }

  ChangeUser(user) {
    return angular.extend(this.currentUser, user);
  }

  URLBaseDecode(str) {
    this.output = str.replace('-', '+').replace('_', '/');
    this.decoder = {
      0: this.output,
      2: () => {
        this.output += '==';
        return this.output;
      },
      3: () => {
        this.output += '=';
        return this.output;
      },
      default: () => {
        throw Object.assign({ URLBase64Error: 'Illegal base64url string!' });
      },
    };
    return window.atob(this.decoder[this.output.length % Number('4')] || this.decoder.default);
  }

  GetUserFromToken() {
    const token = this.Storage.getToken();
    return token ? JSON.parse(this.URLBaseDecode(JSON.stringify(token).split('.')[1])) : {};
  }

  GetPermissions() {
    return this.http
      .get('/api/permissions')
      .then((permissions) => {
        const { Error: GetPermissionsError, Permissions } = permissions.data;
        if (GetPermissionsError) {
          this.Message.error('Ocurrió un error obteniendo los permisos');
          throw new Error('GetUsersError', JSON.stringify(GetPermissionsError));
        }
        return Permissions;
      })
      .catch((getError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error('HTTPRequestError', JSON.stringify(getError));
      });
  }

  GetConfigurations() {
    return this.http
      .get('/api/configurations')
      .then((configurations) => {
        const { Error: GetConfigurationsError, Configurations } = configurations.data;
        if (GetConfigurationsError) {
          this.Message.error('Ocurrió un error obteniendo las configuraciones');
          throw new Error('GetUsersError', JSON.stringify(GetConfigurationsError));
        }
        return Configurations;
      })
      .catch((getError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error('HTTPRequestError', JSON.stringify(getError));
      });
  }

  CreateConfiguration(config) {
    return this.http
      .post('/api/user', config)
      .then((createResult) => {
        const { Error: CreateConfigurationError, Configurations } = createResult.data;
        if (CreateConfigurationError) {
          this.Message.warning(CreateConfigurationError);
          throw new Error(CreateConfigurationError);
        }
        this.Message.success(`La configuración ${ Configurations.Name } fue creada.`);
        this.Observer.Notify();
        return Configurations;
      })
      .catch((postError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error('HTTPRequestError', JSON.stringify(postError));
      });
  }
  Login(user) {
    return this.http
      .post('/api/authenticate', user)
      .then((loginData) => {
        const { Error: userLoginError, User } = loginData.data;
        if (userLoginError) {
          this.Message.error(`Error:${ JSON.stringify(userLoginError) }`);
          throw new Error('UserLoginError', JSON.stringify(userLoginError));
        }
        return User;
      })
      .catch((postError) => {
        this.Message.error('Ocurrió un error con la consulta http');
        throw new Error('HTTPRequestError', JSON.stringify(postError));
      });
  }

  Logout() {
    return this.ChangeUser({});
  }

  ClearListeners() {
    this.Observer.UnsubscribeAll();
    this.Socket.CleanExit();
  }
}
