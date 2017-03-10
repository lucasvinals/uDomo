const Areas = require('../models/areas');
const Devices = require('../models/devices');
const Configurations = require('../models/configurations');
const Backups = require('../models/backups');
const Permissions = require('../models/permissions');
const Routes = require('../models/routes');
const Users = require('../models/users');
const { Promise } = require('es6-promise');

function DropDatabase() {
  return Promise.all(
    [
      Users.remove({}).exec(),
      Permissions.remove({}).exec(),
      Configurations.remove({}).exec(),
      Areas.remove({}).exec(),
      Devices.remove({}).exec(),
      Backups.remove({}).exec(),
      Routes.remove({}).exec(),
    ]
  );
}

module.exports = {
  DropDatabase,
};
