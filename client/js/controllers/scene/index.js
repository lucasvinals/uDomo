function scenesController($scope) {
  $scope.tagline = 'Scenes';
}

export default angular
  .module('uDomo.Scene')
  .controller('sceneController', [ '$scope', scenesController ]);
