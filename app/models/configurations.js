const database = require('mongoose');

module.exports = database.model(
  'Configuration',
  new database.Schema(
    {
      _id: String,
      Name: String,
      createdDate: Date,
      Security: Boolean,
      Readings: Boolean,
      Scenes: Boolean,
      Devices: Boolean,
      Users: Boolean,
    }
  )
);
