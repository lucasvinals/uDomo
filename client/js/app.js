if (DEVELOPMENT) {
  const Require = require;
  window.Popper = Require('popper.js').default;
  window.jQuery = Require('jquery');
  Require('bootstrap/scss/bootstrap.scss');
  Require('bootstrap/js/src/dropdown');
  Require('bootstrap/js/src/alert');
  Require('bootstrap/js/src/modal');
  /**
   * Angular-ui-router loads also Angular.
   */
  Require('../../node_modules/@uirouter/angularjs/release/angular-ui-router.min.js');
  Require('../index.html');
  Require('../views/configuration/index.html');
  Require('../views/device/index.html');
  Require('../views/device/modals/info.html');
  Require('../views/device/modals/save.html');
  Require('../views/home/index.html');
  Require('../views/notFound/index.html');
  Require('../views/parts/header.html');
  Require('../views/parts/login.html');
  Require('../views/permission/index.html');
  Require('../views/reading/index.html');
  Require('../views/reading/others.html');
  Require('../views/reading/server.html');
  Require('../views/scene/index.html');
  Require('../views/security/index.html');
  Require('../views/security/perimeter.html');
  Require('../views/security/video.html');
  Require('../views/security/warnings.html');
  Require('../views/user/index.html');
  Require('../views/zone/index.html');
  Require('../views/zone/modals/create.html');
}

import '../css/style.css';

/**
 * Patterns
 */
import FactoryPatterns from './services/patterns/observer';
const uDomoPatterns = angular.module('uDomo.Patterns', []);
FactoryPatterns.autodeclare(uDomoPatterns);
/**
 * Not Found
 */
import ControllerNotFound from './controllers/notFound';
/**
 * Socket
 */
import FactorySocket from './services/socket';
const uDomoSocket = angular.module('uDomo.Socket', []);
FactorySocket.autodeclare(uDomoSocket);
/**
 * Common
 */
import FactoryCommon from './services/common';
const uDomoCommon = angular.module('uDomo.Common', []);
[ FactoryCommon, ControllerNotFound ].map((component) => component.autodeclare(uDomoCommon));
/**
 * Storage
 */
import FactoryStorage from './services/storage';
const uDomoStorage = angular.module('uDomo.Storage', []);
FactoryStorage.autodeclare(uDomoStorage);
/**
 * Message
 */
import FactoryMessage from './services/message';
const uDomoMessage = angular.module('uDomo.Message', []);
FactoryMessage.autodeclare(uDomoMessage);
/**
 * Backup
 */
import FactoryBackup from './services/backup';
const uDomoBackup = angular.module('uDomo.Backup', []);
FactoryBackup.autodeclare(uDomoBackup);
/**
 * Reading
 */
import FactoryReading from './services/reading';
import ControllerOtherSensor from './controllers/reading/others';
import ControllerServerSensor from './controllers/reading/server';
const uDomoReading = angular.module('uDomo.Reading', []);
[ FactoryReading, ControllerOtherSensor, ControllerServerSensor ]
  .map((component) => component.autodeclare(uDomoReading));
/**
 * Device
 */
import FactoryDevice from './services/device';
import ControllerDevice from './controllers/device';
const uDomoDevice = angular.module('uDomo.Device', []);
[ FactoryDevice, ControllerDevice ].map((component) => component.autodeclare(uDomoDevice));
/**
 * User
 */
import FactoryUser from './services/user';
import ControllerUser from './controllers/user';
const uDomoUser = angular.module('uDomo.User', []);
[ FactoryUser, ControllerUser ].map((component) => component.autodeclare(uDomoUser));
/**
 * Zone
 */
import FactoryZone from './services/zone';
import ControllerZone from './controllers/zone';
const uDomoZone = angular.module('uDomo.Zone', []);
[ FactoryZone, ControllerZone ].map((component) => component.autodeclare(uDomoZone));
/**
 * Main
 */
import FactoryMain from './services/main';
import ControllerMain from './controllers/main';
const uDomoMain = angular.module('uDomo.Main', []);
[ FactoryMain, ControllerMain ].map((component) => component.autodeclare(uDomoMain));
/**
 * Scenes
 */
import FactoryScene from './services/scene';
import ControllerScene from './controllers/scene';
const uDomoScene = angular.module('uDomo.Scene', []);
[ FactoryScene, ControllerScene ].map((component) => component.autodeclare(uDomoScene));
/**
 * Others
 */
import ControllerHome from './controllers/home';
const uDomoHome = angular.module('uDomo.Home', []);
ControllerHome.autodeclare(uDomoHome);
/**
 * Security
 */
import ControllerPerimeter from './controllers/security/perimeter';
import ControllerWarning from './controllers/security/warnings';
import ControllerVideo from './controllers/security/video';
const uDomoSecurity = angular.module('uDomo.Security', []);
[ ControllerPerimeter, ControllerWarning, ControllerVideo ]
  .map((component) => component.autodeclare(uDomoSecurity));
/**
 * Filters
 */
import Filters from './filters';
const uDomoFilter = angular.module('uDomo.Filters', []);
Filters.autodeclare(uDomoFilter);
/**
 * Directives
 */
import Directives from './directives';
const uDomoDirectives = angular.module('uDomo.Directives', []);
Directives.autodeclare(uDomoDirectives);
/**
 * Routes
 */
import Routes from './app.routes';
const uDomoRoutes = angular.module('uDomo.Routes', []);
Routes.autodeclare(uDomoRoutes);
/**
 * uDomo modules dependency injection
 */
const uDomo = angular.module(
  'uDomo',
  [
    'ui.router',
    'uDomo.Routes',
    'uDomo.Patterns',
    'uDomo.Backup',
    'uDomo.Message',
    'uDomo.Socket',
    'uDomo.Storage',
    'uDomo.Filters',
    'uDomo.Directives',
    'uDomo.Main',
    'uDomo.Home',
    'uDomo.User',
    'uDomo.Reading',
    'uDomo.Security',
    'uDomo.Zone',
    'uDomo.Scene',
    'uDomo.Common',
    'uDomo.Device',
  ]
);
/**
 * Configuration
 */
import config from './app.config';
config.autodeclare(uDomo);
/**
 * HMR (Hot Module Replacement) for development.
 */
if (DEVELOPMENT && module.hot) {
  module.hot.accept();
}

/**
 * Handle errors properly /m/
 * https://www.sitepoint.com/proper-error-handling-javascript/
 */
window.addEventListener('error',
  (exception) => {
    const { stack } = exception.error;
    let message = exception.error.toString();

    if (stack) {
      message += `\n${ stack }`;
    }
    window.log.error('Un error! ', message);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/log', true);
    xhr.send(message);
  }
);

export default uDomo.name;
