Users.controller('userController', ['$scope', 'User', 'Common',
function($scope, User, Common){
    'use strict';

    /**
     * Init object for buttons
     */
    $scope.conf = {
                    "Security"  : false,
                    "Scenes"    : false,
                    "Readings"  : false,
                    "Devices"   : false,
                    "Users"     : false
    };

    /**
     * Read User
     */
	let getUsers = (function iifeGetUsers(){
        User.GetUsers((error, users) => {
          error ? log.error('Error obteniendo usuarios ->' + error) : $scope.users = users;
        });
        return iifeGetUsers;
    })();
     
    /**
     * Observer pattern
     */
    User.Subscribe(getUsers);
        
    /**
     * Remove User
     */
    $scope.removeUser = (id) => { User.DeleteUser(id); };

    /**
     * Modify User
     */
    $scope.modifyUser = (user) => { User.ModifyUser(user); };

    /**
     * Clean exit 
     */
    $scope.$on('$destroy', () => { User.clearListeners(); });
    
    $scope.canRemove = () => $rootScope.currentUser.Administrator;
    
    /**
     * Get Permissions
     */
    let getPermissions = (function iifePermissions() {
        User.GetPermissions((error, permissions) => {
            $scope.permissions = permissions;
        });
        return iifePermissions;
    })();

    /**
     * Get Configurations
     */
    let getConfigurations = (function iifeConfigurations() {
        User.GetConfigurations((errors, configurations) => {
            $scope.configurations = configurations;
        });
        return iifeConfigurations;
    })();

    $scope.createConfiguration = (c) => {
        c._id = Common.newID();
        User.CreateConfiguration(c, (e, success) => {
            e && 
            log.error("Ocurrió un error creando la configuración") ||
            log.success("Se creó la configuración.");
        });
    };
}]);
