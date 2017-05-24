import io from 'socket.io-client';
import { service, inject } from 'ng-annotations';

@service('FactorySocket')
@inject('$rootScope')
export default class {
  /*@ngInject*/
  constructor(rootScope) {
    this.rootScope = rootScope;
    this.IO = io;
    this.socketURL = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host;
    this.socket = this.IO.connect(
      this.socketURL,
      {
        forceNew: true,
        reconnect: true,
        reconnectionDelay: 400,
      }
    );
  }
  on(eventName, onCallback) {
    return this.socket.on(eventName, (...args) =>
      this.rootScope.$apply(
        () =>
          onCallback.apply(this.socket, args)
      )
    );
  }
  emit(eventName, dataToSend, response) {
    return this.socket.emit(eventName, dataToSend, (...args) =>
      this.rootScope.$apply(() => response && response.apply(this.socket, args))
    );
  }
  clear(eventName) {
    return this.socket.off(eventName);
  }
  cleanExit() {
    return this.socket.close();
  }
}
