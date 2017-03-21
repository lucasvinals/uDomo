const database = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const deviceSchema = new database.Schema(
  {
    _id: String,
    Name: String,
    IP: String,
    Number,
    Saved: Boolean,
    Online: Boolean,
    Zone: [ { type: String, ref: 'Zone' } ],
    lastMessage: Date,
    Temperature: Number,
    Pressure: Number,
    Altitude: Number,
    Humidity: Number,
    Light: Number,
    Mode: String,
  }
);

/**
 * For more information about how this plugin replace methods,
 * go to: https://www.npmjs.com/package/mongoose-delete#method-overridden
 */
deviceSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = database.model('Device', deviceSchema);
