const database = require('mongoose');
const Configuration = require('./configurations').schema;

module.exports = database.model(
  'Permission',
  new database.Schema(
    {
      _id: String,
      Name: String,
      Configuration,
    }
  )
);
