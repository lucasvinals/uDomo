const CreateZone = require('./zone');
const CreateDevice = require('./device');
const DropDatabase = require('./database');
const connectDatabase = require('../tools/connectToMongoDB.js');

function seedDatabase() {
  if (process.env.NODE_ENV === 'development') {
    connectDatabase();
    return DropDatabase()
      .then(CreateZone)
      .then((zones) => zones.map(CreateDevice))
      .catch((seedError) => {
        throw new Error(seedError);
      });
  }
  return Promise.resolve();
}

module.exports = seedDatabase;
