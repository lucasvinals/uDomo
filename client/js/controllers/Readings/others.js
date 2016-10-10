Readings.controller('Others', ['$scope', 'Readings', 'Socket', 
function($scope, Readings, Socket){
    
    /***** Style - Set the correct color to temperature intervals ******/
    $scope.temperatureColor = (temperature) => {
        return Readings.temperatureColor(temperature);
    };
    /*******************************************************************/
    
    /* Socket - Listen for incomming messages in 'changedValues' event */
    Socket.on('serverSensor', (data) => {
        /*************** Server Values ******************/
        $scope.publicIP = data.Server.PublicIP;
        $scope.coreTemperature = data.Server.Temperature;
        /************************************************/
    });
    /*******************************************************************/
    $scope.coreTemperature = $scope.coreTemperature || 22; //TEST ONLY
    /* Remove Listeners when leave the page */
    $scope.$on('$destroy', (event) => {
        Socket.clear();
    });                                              
}]);