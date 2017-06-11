const database = require('mongoose');
const { get, set } = require('lodash');
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

/**
 * Update property Saved of the devices in process.devices
 * Curryfied function to use in chain of promises.
 */
deviceSchema.statics.updateSavedTo = (status) =>
  (device) =>
    set(
      process.devices.find(
        (dev) => get(dev, '_id', 0) === get(device, '_id')
      ),
      'Saved',
      status
    ) || {};

module.exports = database.model('Device', deviceSchema);
