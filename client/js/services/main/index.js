import { service, inject } from 'ng-annotations';

@service('FactoryMain')
@inject('FactorySocket')
export default class {
  constructor(Socket) {
    this.Socket = Socket;
  }
  /**
   * Clear listeners from main page.
   */
  ClearListeners() {
    this.Socket.Clear('Main/User/SignIn/Response');
    this.Socket.Clear('Main/User/Create/Response');
    this.Socket.Emit('disconnect', {});
  }
}
