
let Readings = angular.module("Readings", []);

Readings.factory("Readings", ["$http", ($http) => {
    'use strict';
        let Facade = {
            temperatureColor: (temperature) => {
                switch(true){
                    case (temperature < 14):
                        return 'text-info';
                    case (temperature >= 14 && temperature < 25):
                        return 'text-success';
                    case (temperature >= 25 && temperature < 35):
                        return 'text-warning';
                    case (temperature > 35):
                        return 'text-danger';
                    default:
                        return 'bold';	
                };
            },
            lightType: ($scope, maxIndoor, maxOutdoor) => {
                $scope.maxLight === maxOutdoor ? 
                    $scope.maxLight = maxIndoor :
                    $scope.maxLight = maxOutdoor;
            },
            percentLight: (light, maxValue) => {
                var percent = ((light * 100) / maxValue);
                percent > 100 ? percent =  '100%' : percent += '%';
                return percent;
            },
            clearListener: (name) => {
                
            }
        };
        return Facade;
}]);
