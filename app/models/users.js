const database = require("mongoose");
const Permissions = require('./permissions').schema;

module.exports = database.model(
  'User',
  new database.Schema(
    {
      _id: String,
      Token: String,
      Name: String,
      Age: Number,
      Username: String,
      Email: String,
      Password: String,
      Permissions,
    }
  )
);
