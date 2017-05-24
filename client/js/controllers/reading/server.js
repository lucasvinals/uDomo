import Reading from '../../services/reading';
import Socket from '../../services/socket';

function ServerController($scope) {
  /* Style - Set the correct color to temperature intervals */
  $scope.temperatureColor = (temperature) => Reading.temperatureColor(temperature);

  /**
   * Styles
   */
  /**
   * Change the current bar width
   */
  $scope.changeTypeOfLight = (maxIndoor, maxOutdoor) => Reading.lightType($scope, maxIndoor, maxOutdoor);

  /**
   * Set light percent
   */
  $scope.percentLight = (light, maxValue) => Reading.percentLight(light, maxValue);

  Socket.on('bienvenido', (mensaje) => {
    window.log.info(`Mensaje: ${ mensaje }`);
  });

  /* Socket - Listen for incomming messages in 'changedValues' event */
  Socket.on('serverSensor', (sensorData) => {
    /**
     * ServerSensor - TSL2561
     */
    $scope.serverSensorL = sensorData.Sensor.Light.readValue;
    $scope.maxLightIndoor = sensorData.Sensor.Light.maxIn;
    $scope.maxLightOutdoor = sensorData.Sensor.Light.maxOut;
    $scope.maxLight = $scope.maxLight || $scope.maxLightIndoor;

    /**
     * ServerSensor - BMP180
     */
    $scope.serverSensorT = sensorData.Sensor.Temperature;
    $scope.serverSensorP = sensorData.Sensor.Pressure;
    $scope.serverSensorA = sensorData.Sensor.Altitude;
  });

  $scope.$on('$destroy', () => {
    Socket.clear('bienvenido');
    Socket.clear('serverSensor');
  });
}

export default angular.module('uDomo.Reading').controller('ServerController', [ '$scope', ServerController ]);
