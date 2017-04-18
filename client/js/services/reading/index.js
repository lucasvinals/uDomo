/* eslint no-magic-numbers:0, no-nested-ternary:0, no-confusing-arrow:0 */
function ReadingsFactory() {
  return {
    temperatureColor: (temperature) =>
      temperature < 14 ? 'text-info' :
        (temperature >= 14 && temperature < 25) ? 'text-warning' :
        (temperature > 35) ? 'text-danger' :
        'bold',
    lightType: ($scope, maxIndoor, maxOutdoor) => {
      $scope.maxLight = $scope.maxLight === maxOutdoor ? maxIndoor : maxOutdoor;
    },
    // percentLight: (light, maxValue) => {
      // var percent = ((light * 100) / maxValue);
      // percent > 100 ? percent =  '100%' : percent += '%';
      // return percent;
    // },
    // clearListener: (name) => {}
  };
}

export default angular.module('uDomo.Reading').factory('ReadingsFactory', ReadingsFactory);
