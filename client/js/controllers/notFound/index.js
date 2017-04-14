function notFoundController($rootScope, $scope) {
  // If we are here, a 404 page, set a cool background
  $rootScope.ChangeImage = { background: 'url(img/notFound.jpg)', 'background-size': 'cover' };

  // Reset background when leaves the controller
  $scope.$on('$destroy', () => {
    $rootScope.ChangeImage = null;
  });
}

module.exports = angular
  .module('uDomo.NotFound')
  .controller('notFoundController', [ '$rootScope', '$scope', notFoundController ]);
