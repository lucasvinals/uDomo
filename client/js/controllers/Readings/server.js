Readings.controller('Server', ['$scope', 'Readings', 'Socket',
function($scope, Readings, Socket){
    'use strict';
    /* Style - Set the correct color to temperature intervals */
    $scope.temperatureColor = (temperature) => {
        return Readings.temperatureColor(temperature);
    };
    
    /*************************** Styles ********************************/
    
    /*********** Change the current bar width ********************/
    $scope.changeTypeOfLight = (maxIndoor, maxOutdoor) => {
        Readings.lightType($scope, maxIndoor, maxOutdoor);
    };
    
    /******************** Set light percent **********************/
    $scope.percentLight = (light, maxValue) => {
        return Readings.percentLight(light, maxValue);
    };
    /*************************************************************/
    
    /*******************************************************************/
    Socket.on('bienvenido', (mensaje) => {
        log.info('Mensaje: ' + mensaje);
    });
    
    /* Socket - Listen for incomming messages in 'changedValues' event */
    Socket.on('serverSensor', (data) => {
        //ServerSensor - TSL2561
        $scope.serverSensorL = data.Sensor.Light.readValue;
        $scope.maxLightIndoor = data.Sensor.Light.maxIn;
        $scope.maxLightOutdoor = data.Sensor.Light.maxOut;
        $scope.maxLight = $scope.maxLight || $scope.maxLightIndoor;
        /**********************************************************/

        //ServerSensor - BMP180
        $scope.serverSensorT = data.Sensor.Temperature;
        $scope.serverSensorP = data.Sensor.Pressure;
        $scope.serverSensorA = data.Sensor.Altitude;
        /**************************************************************/
    });
    
    $scope.$on('$destroy', (event) => {
        Socket.clear('bienvenido');
        Socket.clear('serverSensor');
    });  
}]);