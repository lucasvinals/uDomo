const database = require('mongoose');

module.exports = database.model(
  'Backups',
  new database.Schema(
    {
      _id: String,
      DisplayName: String,
      Pathname: String,
      Datetime: Date,
    }
  )
);
