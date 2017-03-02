const database = require("mongoose");
const Areas = require('./areas');

module.exports = database.model(
  'Device',
  new database.Schema(
    {
      _id: String,
      Name: String,
      IP: String,
      N: Number,
      Saved: Boolean,
      Online: Boolean,
      Area: Areas.schema,
      lastMessage: Date,
      Temperature: Number,
      Pressure: Number,
      Altitude: Number,
      Humidity: Number,
      Light: Number,
      Mode: String,
    }
  )
);
