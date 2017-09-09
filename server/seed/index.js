const CreateZone = require('./zone');
const CreateDevice = require('./device');
const DropDatabase = require('./database');
const connectDatabase = require('../tools/connectToMongoDB.js');

function seedDatabase() {
  connectDatabase();
  return DropDatabase()
    .then(CreateZone)
    .then((zones) => zones.map(CreateDevice))
    .catch((seedError) => {
      throw new Error(seedError);
    });
}

module.exports = seedDatabase;
