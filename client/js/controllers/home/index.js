function homeController($scope) {
  window.log.success('Llega a HOME!');
  $scope.message = 'Llega a HOME!';
}

export default angular.module('uDomo.Home').controller('homeController', [ '$scope', homeController ]);
