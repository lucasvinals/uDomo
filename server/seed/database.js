const Zone = require('../api/zone/zone.model');
const Device = require('../api/device/device.model');
const Configuration = require('../api/configuration/configuration.model');
const Backup = require('../api/backup/backup.model');
const Permission = require('../api/permission/permission.model');
const Route = require('../api/route/route.model');
const User = require('../api/user/user.model');
const Promise = require('bluebird');

function DropDatabase() {
  return Promise.all(
    [
      User.remove({}),
      Permission.remove({}),
      Configuration.remove({}),
      Zone.remove({}),
      Device.remove({}),
      Backup.remove({}),
      Route.remove({}),
    ]
  );
}

module.exports = DropDatabase;
