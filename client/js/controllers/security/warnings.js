function WarningController($scope) {
  $scope.tagline = 'Last warnings';
}

export default angular.module('uDomo.Security').controller('WarningController', [ '$scope', WarningController ]);
