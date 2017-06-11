const Zone = require('../../server/api/zone/zone.model');
const Promise = require('bluebird');
const uuid = require('uuid/v4');

function CreateZone() {
  return Zone
    .findOne({})
    .exec()
    .then((zones) => {
      if (zones) {
        return null;
      }
      const seedZones = [
        {
          _id: uuid(),
          Name: 'Room',
          Created: new Date(),
        },
        {
          _id: uuid(),
          Name: 'Bathroom',
          Created: new Date(),
        },
        {
          _id: uuid(),
          Name: 'Kitchen',
          Created: new Date(),
        },
      ];
      return Promise.all(seedZones.map((dummyZone) => Zone.create(dummyZone)));
    });
}

module.exports = CreateZone;
