import { config, inject } from 'ng-annotations';

@config('Routes')
@inject('$stateProvider', '$locationProvider', '$urlRouterProvider')
export default class {
  constructor($stateProvider, $locationProvider, $urlRouterProvider) {
    this.stateProvider = $stateProvider;
    // this.$httpProvider = $httpProvider;
    this.urlRouterProvider = $urlRouterProvider;
    this.locationProvider = $locationProvider;
    // this.SetInterceptors();
    this.States();
    this.QuitHashes();
  }
  // SetInterceptors() {
  //   this.$httpProvider.interceptors.push(
  //     [
  //       '$q', '$location',
  //       ($q, $location) => Object.assign(
  //         {
  //           'request': (configuration) => {
  //             configuration.headers = configuration.headers || {};
  //             /**
  //              * this.Storage.getToken();
  //              */
  //             const token = null;
  //             if (token) {
  //               config.headers.Authorization = `Bearer ${ token }`;
  //             }
  //             return config;
  //           },
  //           'responseError': (response) => {
  //             if (response.status === Number('401') || response.status === Number('403')) {
  //               $location.path('/');
  //             }
  //             return $q.reject(response);
  //           },
  //         }
  //       ),
  //     ]
  //   );
  // }

  States() {
    this.stateProvider
    /**
    * Main Page - Contains all the information that persists.
    * abstract:true mantains the content static
    */
      .state('uDomo', {
        url: '/',
        abstract: true,
      })
      /**
       * Homepage - Welcome and all the information to the user
       */
      .state('uDomo.home', {
        url: '',
        templateUrl: './views/home/index.html',
        controller: 'ControllerHome',
      })
      /**
       * User management
       */
      .state('uDomo.users', {
        url: 'users',
        templateUrl: './views/user/index.html',
        controller: 'ControllerUser',
      })
      /**
       * configuration scenarios for each group of users
       */
      .state('uDomo.users.configurations', {
        url: 'user/configurations',
        templateUrl: './views/configuration/index.html',
        controller: 'ControllerUser',
      })
      /**
       * Permissions
       */
      .state('uDomo.user.permissions', {
        url: 'user/permissions',
        templateUrl: './views/permission/index.html',
        controller: 'ControllerUser',
      })
      /**
       * Zones management
       */
      .state('uDomo.zones', {
        url: 'zones',
        templateUrl: './views/zone/index.html',
        controller: 'ControllerZone',
        controllerAs: 'Zone',
      })
      /**
       * Devices - Save, Program, view info, etc
       */
      .state('uDomo.devices', {
        url: 'devices',
        templateUrl: './views/device/index.html',
        controller: 'ControllerDevice',
        controllerAs: 'Device',
      })
      /**
       * Scenes state and management
       */
      .state('uDomo.scenes', {
        url: 'scenes',
        templateUrl: './views/scene/index.html',
        controller: 'ControllerScene',
      })
      /**
       * Readings - Others
       */
      .state('uDomo.otherReadings', {
        url: 'readings/others',
        templateUrl: './views/reading/others.html',
        controller: 'ControllerOtherSensors',
      })
      /**
       * Readings - Server values
       */
      .state('uDomo.serverReadings', {
        url: 'readings/server',
        templateUrl: './views/reading/server.html',
        controller: 'ControllerServerSensors',
      })
      /**
       * Live cameras and other videos
       */
      .state('uDomo.videos', {
        url: 'security/videos',
        templateUrl: './views/security/videos.html',
        controller: 'ControllerVideo',
      })
      .state('uDomo.perimeter', {
        url: 'security/perimeter',
        templateUrl: './views/security/perimeter.html',
        controller: 'ControllerPerimeter',
      })
      .state('uDomo.warnings', {
        url: 'security/warnings',
        templateUrl: './views/security/warnings.html',
        controller: 'ControllerPerimeter',
      })
      // /**
      //  * 404 - Not Found page
      //  */
      .state('uDomo.notFound', {
        url: '404',
        templateUrl: './views/notFound/index.html',
        controller: 'ControllerNotFound',
      });
    /**
     * Otherwise redirect to the "404 - not found" page
     */
    // this.urlRouterProvider.otherwise('uDomo.notFound');
    // this.urlRouterProvider.otherwise(($injector) => $injector.get('$state').go('uDomo.notFound'));
  }

  QuitHashes() {
    /**
     * Quits the hashes in the URL..
     */
    this.locationProvider.html5Mode({ enabled: true, requireBase: false });
  }
/*
$http.get('/api/Routes', function(e, r){
var routeProv = $routeProvider;
console.log('Cantidad de rutas: ', r.length);
r.length && r.forEach(function(ruta){
routeProv.when(ruta.relPath, {
templateUrl: ruta.filePath,
controller: ruta.controller
});
});
});
*/
// This setting should come of the DB.....
}
