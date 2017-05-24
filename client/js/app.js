import angular from 'angular';
import 'angular-ui-router';
import 'bootstrap';
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
 * Socket
 */
import FactorySocket from './services/socket';
const uDomoSocket = angular.module('uDomo.Socket', []);
FactorySocket.autodeclare(uDomoSocket);
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
import ControllerReading from './controllers/reading';
const uDomoReading = angular.module('uDomo.Reading', []);
[ FactoryReading, ControllerReading ].map((component) => component.autodeclare(uDomoReading));
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
import ControllerSecurity from './controllers/security';
const uDomoSecurity = angular.module('uDomo.Security', []);
ControllerSecurity.autodeclare(uDomoSecurity);
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
 * uDomo modules dependency injection
 */
const uDomo = angular.module(
  'uDomo',
  [
    'ui.router',
    'uDomo.Patterns',
    'uDomo.Filters',
    'uDomo.Main',
    'uDomo.Home',
    'uDomo.User',
    'uDomo.Route',
    'uDomo.Reading',
    'uDomo.Security',
    'uDomo.Zone',
    'uDomo.Scene',
    'uDomo.Common',
    'uDomo.Device',
    'uDomo.NotFound',
    'uDomo.Directives',
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
if (window.DEVELOPMENT && module.hot) {
  module.hot.accept();
}

export default uDomo.name;
