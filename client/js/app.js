/**
 * External
 */
import angular from 'angular';
import 'angular-ui-router';
/**
 * uDomo modules initialization
 */
angular.module('uDomo.Patterns', []);
angular.module('uDomo.Main', []);
angular.module('uDomo.Home', []);
angular.module('uDomo.User', []);
angular.module('uDomo.Route', []);
angular.module('uDomo.Reading', []);
angular.module('uDomo.Security', []);
angular.module('uDomo.Zone', []);
angular.module('uDomo.Scene', []);
angular.module('uDomo.Common', []);
angular.module('uDomo.Device', []);
angular.module('uDomo.NotFound', []);
angular.module('uDomo.Filter', []);
angular.module('uDomo.Directive', []);
/**
 * uDomo Services
 */
import './services/patterns/observer';
import './services/common';
import './services/storage';
import './services/socket';
import './services/message';
import './services/reading';
import './services/backup';
import './services/device';
import './services/user';
import './services/zone';
import './services/main';
/**
 * uDomo Controllers
 */
import './controllers/home';
import './controllers/device';
import './controllers/notFound';
import './controllers/reading';
import './controllers/security';
import './controllers/scene';
import './controllers/user';
import './controllers/zone';
import './controllers/main';
/**
 * uDomo Filters
 */
import './filters';
/**
 * uDomo Directives
 */
import './directives';
/**
 * uDomo Configuration
 */
import config from './app.config';

const uDomo = angular.module(
  'uDomoApp',
  [
    'ui.router',
    'uDomo.Patterns',
    'uDomoFilters',
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
  ]
);

uDomo.config(config);
