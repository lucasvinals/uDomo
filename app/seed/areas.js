const Area = require('../models/areas');
const _ = require('lodash');
const { Promise } = require('es6-promise');

function CreateArea() {
  Area
    .findOne({})
    .exec()
    .then((areas) => {
      if (areas) {
        return null;
      }
      const seedAreas = [
        {
          Name: 'Room',
          Created: new Date(),
        },
        {
          Name: 'Bathroom',
          Created: new Date(),
        },
        {
          Name: 'Kitchen',
          Created: new Date(),
        },
      ];
      return Promise.all(_.map(seedAreas, (dummyArea) => Area.create(dummyArea)));
    });
}

module.exports = {
  CreateArea,
};
