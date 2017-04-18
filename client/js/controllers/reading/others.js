import Reading from '../../services/reading';
import Socket from '../../services/socket';

function OthersSensorsController($scope) {
  /**
   * Style - Set the correct color to temperature intervals
   */
  $scope.temperatureColor = (temperature) => Reading.temperatureColor(temperature);

  /**
   * Socket - Listen for incomming messages in 'changedValues' event
   */
  Socket.on('serverSensor', (serverData) => {
    /**
     * Server Values
     */
    $scope.publicIP = serverData.Server.PublicIP;
    $scope.coreTemperature = serverData.Server.Temperature;
  });

  $scope.coreTemperature = $scope.coreTemperature || 22; // eslint-disable-line
  /* Remove Listeners when leave the page */
  $scope.$on('$destroy', () => {
    Socket.clear();
  });
}

export default angular.module('Reading').controller('OthersSensorsController', [ '$scope', OthersSensorsController ]);
