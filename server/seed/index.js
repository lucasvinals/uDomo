const CreateZone = require('./zone');
const CreateDevice = require('./device');
const DropDatabase = require('./database');

function seedDatabase() {
  if (process.env.NODE_ENV === 'development') {
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
