const database = require('mongoose');

module.exports = database.model(
  'Zone',
  new database.Schema(
    {
      _id: String,
      Name: String,
      Created: Date,
    }
  )
);
