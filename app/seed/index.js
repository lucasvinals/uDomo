const { CreateArea } = require('./areas');
const { CreateDevice } = require('./devices');
const { DropDatabase } = require('./common');
const { map } = require('lodash');

function seedDatabase() {
  DropDatabase()
    .then(CreateArea)
    .then((areas) => map(areas, CreateDevice))
    .catch((seedError) => {
      throw new Error(seedError);
    });
}

module.exports.seedDatabase = seedDatabase;
