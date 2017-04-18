function RouteConfig($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider) {
  $httpProvider.interceptors.push([
    '$q', '$location', 'Storage',
    ($q, $location, Storage) => Object.assign(
      {
        'request': (config) => {
          config.headers = config.headers || {};
          const token = Storage.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${ token }`;
          }
          return config;
        },
        'responseError': (response) => {
          if (response.status === 401 || response.status === 403) {  /* eslint no-magic-numbers:1 */
            $location.path('/');
          }
          return $q.reject(response);
        },
      }
    ),
  ]
);
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

  $stateProvider
/**
* Main Page - Contains all the information that persists.
* abstract:true mantains the content static
*/
  .state('main', {
    abstract: true,
    url: '/',
    templateUrl: '/views/index.html',
    controller: 'mainController',
  })
  /**
   * Homepage - Welcome and all the information to the user
   */
  .state('home', {
    url: '/',
    templateUrl: '/views/home/home.html',
    controller: 'homeController',
  })
  /**
   * User management
   */
  .state('users', {
    url: '/users',
    templateUrl: '/views/users/users.html',
    controller: 'userController',
  })
  /**
   * configuration scenarios for each group of users
   */
  .state('users.configurations', {
    url: 'configurations',
    templateUrl: '/views/users/configurations.html',
    controller: 'ConfigutarationsController',
  })
  /**
   * Areas management
   */
  .state('areas', {
    url: '/areas',
    templateUrl: '/views/areas/areas.html',
    controller: 'areaController',
  })
  /**
   * Devices - Save, Program, view info, etc
   */
  .state('devices', {
    url: '/devices',
    templateUrl: '/views/devices/devices.html',
    controller: 'deviceController',
  })
  /**
   * Scenes state and management
   */
  .state('scenes', {
    url: '/scenes',
    templateUrl: '/views/scenes/scenes.html',
    controller: 'sceneController',
  })
  /**
   * Readings - Others
   */
  .state('otherReadings', {
    url: '/readings/others',
    templateUrl: '/views/readings/others.html',
    controller: 'Others',
  })
  /**
   * Readings - Server values
   */
  .state('serverReadings', {
    url: '/readings/server',
    templateUrl: '/views/readings/server.html',
    controller: 'Server',
  })
  /**
   * Live cameras and other videos
   */
  .state('videos', {
    url: '/security/videos',
    templateUrl: '/views/security/video.html',
    controller: 'Video',
  })
  .state('permissions', {
    url: '/users/permissions',
    templateUrl: '/views/users/permissions.html',
    controller: 'userController',
  })
  .state('configurations', {
    url: '/users/configurations',
    templateUrl: '/views/users/configurations.html',
    controller: 'userController',
  })
  // /**
  //  * 404 - Not Found page
  //  */
  .state('notFound', {
    url: '/404',
    templateUrl: '/views/home/notFound.html',
    controller: 'notFoundController',
  });
  /**
   * Otherwise redirect to the "404 - not found" page
   */
  // $urlRouterProvider.otherwise($stateProvider.go('notFound'));
  /**
   * Quits the hashes in the URL..
   */
  $locationProvider.html5Mode({ enabled: true, requireBase: false });
}

export default angular
  .module('Route')
  .config([ '$stateProvider', '$httpProvider', '$urlRouterProvider', '$locationProvider', RouteConfig ]);
