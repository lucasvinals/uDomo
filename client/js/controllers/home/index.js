function homeController($scope) {
  window.log.success('Llega a HOME!');
}

module.exports = angular
  .module('uDomo.Home')
  .controller('homeController', [ '$scope', homeController ]);
