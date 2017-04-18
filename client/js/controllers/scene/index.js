function scenesController($scope) {
  $scope.tagline = 'Scenes';
}

export default angular
  .module('uDomo.Scenes')
  .controller('sceneController', [ '$scope', scenesController ]);
