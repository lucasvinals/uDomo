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
  clearListeners() {
    this.Socket.clear('Main/User/SignIn/Response');
    this.Socket.clear('Main/User/Create/Response');
    this.Socket.emit('disconnect', {});
  }
}
