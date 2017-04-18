function WarningController($scope) {
  $scope.tagline = 'Last warnings';
}

export default angular.module('Security').controller('WarningController', [ '$scope', WarningController ]);
