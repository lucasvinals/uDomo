
Users.controller('userController', ['$scope', 'User',
function($scope, User){
    'use strict';

    /********************************* Read User ***************************************/
	let getUsers = (function iifeGetUsers(){
        User.GetUsers((error, users) => {
          error ? log.error('Error obteniendo usuarios ->' + error) : $scope.users = users;
        });
        return iifeGetUsers;
    })();
    /************************************************************************************/
     
    /*************************** Observer pattern ***************************************/
    User.Subscribe(getUsers);
    /************************************************************************************/
        
    /********************************* Remove User *************************************/
    $scope.removeUser = (id) => {
        User.DeleteUser(id);
    };
    /************************************************************************************/

    /********************************* Modify User ***************************************/
    $scope.modifyUser = (user) => {
        User.ModifyUser(user);
    };
    /************************************************************************************/    

    /* Clean exit */
    $scope.$on('$destroy', () => {
        User.clearListeners();
    });
    
    $scope.canRemove = () => {
        return $rootScope.currentUser.Administrator === true ? true : false;
    };
    
    $scope.getPermissions = function(){
        User.GetPermissions(function(permissions, errors){
            $scope.permissions = permissions;
        });
    };

    $scope.getConfigurations = function(){
        User.GetConfigurations(function(configurations, errors){
            $scope.configurations = configurations;
        });
    };
}]);
