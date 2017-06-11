import { inject, controller } from 'ng-annotations';

@controller('ControllerOtherSensors')
@inject('FactoryReading', 'SocketFactory', '$scope')
export default class {
  constroller(Reading, Socket, scope) {
    this.Reading = Reading;
    this.Socket = Socket;
    this.scope = scope;
    this.coreTemperature = Number('22');
    this.ListenForServerData();
    this.RemoveListenersOnDestroy();
  }
  /**
   * Style - Set the correct color to temperature intervals
   *  This should be common in both modules
   */
  TemperatureColor(temperature) {
    return this.Reading.temperatureColor(temperature);
  }
  ListenForServerData() {
    this.Socket.On('serverSensor', (serverData) => {
      /**
       * Server Values
       */
      this.publicIP = serverData.Server.PublicIP;
      this.coreTemperature = serverData.Server.Temperature;
    });
  }
  RemoveListenersOnDestroy() {
    this.scope.$on('$destroy', () => this.Socket.Clear());
  }
}
