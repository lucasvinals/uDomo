angular.module('NotFound', []).controller('notFoundController', ['$rootScope', '$scope', 
function($rootScope, $scope){
	'use strict';
    //If we are here, a 404 page, set a cool background 
    $rootScope.ChangeImage = {"background": 'url(img/notFound.jpg)', "background-size": 'cover'};
    
    //Reset background when leaves the controller
    $scope.$on('$destroy', (event) => {
        $rootScope.ChangeImage = null;
	});
}]);
