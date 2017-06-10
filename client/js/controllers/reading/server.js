import { inject, controller } from 'ng-annotations';

@controller('ControllerServerSensors')
@inject('$scope', 'FactorySocket', 'FactoryReading')
export default class {
  constructor(scope, Socket, Reading) {
    this.Socket = Socket;
    this.Reading = Reading;
    this.scope = scope;
    this.AttachServerSensors();
  }
  /**
   * Style - Set the correct color to temperature intervals
   */
  TemperatureColor(temperature) {
    return this.Reading.temperatureColor(temperature);
  }

  ChangeTypeOfLight(maxIndoor, maxOutdoor) {
    return this.Reading.lightType(this, maxIndoor, maxOutdoor);
  }

  PercentLight(light, maxValue) {
    return this.Reading.percentLight(light, maxValue);
  }

  AttachServerSensors() {
    /* Socket - Listen for incomming messages in 'changedValues' event */
    this.Socket.on('serverSensor', (sensorData) => {
      /**
       * ServerSensor - TSL2561
       */
      this.serverSensorL = sensorData.Sensor.Light.readValue;
      this.maxLightIndoor = sensorData.Sensor.Light.maxIn;
      this.maxLightOutdoor = sensorData.Sensor.Light.maxOut;
      this.maxLight = this.maxLight || this.maxLightIndoor;

      /**
       * ServerSensor - BMP180
       */
      this.serverSensorT = sensorData.Sensor.Temperature;
      this.serverSensorP = sensorData.Sensor.Pressure;
      this.serverSensorA = sensorData.Sensor.Altitude;
    });
  }
  ClearListeners() {
    this.scope.$on('$destroy', () => {
      this.Socket.clear('serverSensor');
    });
  }
}
