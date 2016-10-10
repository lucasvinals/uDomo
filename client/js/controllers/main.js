Main.controller('mainController', 
[
    '$scope', '$rootScope', '$location',
    'Storage', 'User', 'Common', 'Main',
function($scope, $rootScope, $location, Storage, User, Common, Main){
    'use strict';
    
    $scope.Login = function(user) {
        User.Login(user, function(error, resUser){
            if(typeof resUser !== 'null'){
                $scope.user = '';
                Storage.setToken(resUser.Token);
                $location.path('/');
            }  
        });
    };
 
    $scope.CreateUser = function(user) {
        user._id = Common.newID();
        user.Permissions = {"Administrador": true}; // TEST ONLY
        
        User.CreateUser(user, function(error, resUser){
            if(typeof resUser !== 'null' && typeof error === 'null'){
                Storage.setToken(resUser.Token);
                $location.path('/');
            }
       });
    };

    $scope.Logout = function() {
        User.Logout();
        Storage.deleteToken(); //Deberia ir en users
        $location.path('/');
    };

    $rootScope.Token = Storage.getToken();
        
    /* Clean exit */
    $scope.$on('$destroy', function (event) {
        Main.clearListeners();
    });
}]);
