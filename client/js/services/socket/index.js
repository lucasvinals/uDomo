import io from 'socket.io-client';
import { service, inject } from 'ng-annotations';

@service('FactorySocket')
@inject('$rootScope', '$location')
export default class {
  constructor(rootScope, location) {
    this.rootScope = rootScope;
    this.socket = io.connect(
      `${ location.protocol() === 'https' ? 'wss' : 'ws' }://${ location.host() }:${ location.port() }`,
      {
        forceNew: true,
        reconnect: true,
        reconnectionDelay: 400,
      }
    );
  }
  On(eventName, onCallback) {
    return this.socket.on(eventName, (...args) =>
      this.rootScope.$apply(
        () =>
          onCallback.apply(this.socket, args)
      )
    );
  }
  Emit(eventName, dataToSend, response) {
    return this.socket.emit(eventName, dataToSend, (...args) =>
      this.rootScope.$apply(() => response && response.apply(this.socket, args))
    );
  }
  Clear(eventName) {
    return this.socket.off(eventName);
  }
  CleanExit() {
    return this.socket.close();
  }
}
