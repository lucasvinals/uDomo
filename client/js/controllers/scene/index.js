function scenesController($scope) {
  $scope.tagline = 'Scenes';
}

module.exports = angular
  .module('uDomo.Scenes')
  .controller('sceneController', [ '$scope', scenesController ]);
