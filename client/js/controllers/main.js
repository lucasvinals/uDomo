Main.controller('mainController', 
[
    '$scope', '$rootScope', '$location',
    'Storage', 'User', 'Common', 'Main',
function($scope, $rootScope, $location, Storage, User, Common, Main){
    'use strict';
    
    $scope.Login = (user) => {
        User.Login(user, (error, resUser) => {
            if(typeof resUser !== 'null'){
                $scope.user = '';
                Storage.setToken(resUser.Token);
                $location.path('/');
            }  
        });
    };
 
    $scope.CreateUser = (user) => {
        user._id = Common.newID();
        user.Permissions = {"Administrador": true}; // TEST ONLY
        
        User.CreateUser(user, (error, resUser) => {
            if(typeof resUser !== 'null' && typeof error === 'null'){
                Storage.setToken(resUser.Token);
                $location.path('/');
            }
       });
    };

    $scope.Logout = () => {
        User.Logout();
        Storage.deleteToken(); //Deberia ir en users
        $location.path('/');
    };

    $rootScope.Token = Storage.getToken();
    

    $scope.getBackups = () => {
        Backups.getAll((e, backups) => {
            $scope.currentBackups = backups;
        });
    };

    /* Clean exit */
    $scope.$on('$destroy', (event) => {
        Main.clearListeners();
    });
}]);
