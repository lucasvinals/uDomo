const database = require('mongoose');

module.exports = database.model(
  'Route',
  new database.Schema(
    {
      _id: String,
      relPath: String,
      filePath: String,
      controller: String,
    }
  )
);
