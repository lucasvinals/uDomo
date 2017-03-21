const CreateZone = require('./zone');
const CreateDevice = require('./device');
const DropDatabase = require('./database');
const { ENV } = require('../config/environment');

function seedDatabase() {
  if (ENV === 'development') {
    return DropDatabase()
    .then(CreateZone)
    .then((zones) => zones.map(CreateDevice))
    .catch((seedError) => {
      throw new Error(seedError);
    });
  }
  return true;
}

module.exports = seedDatabase;
