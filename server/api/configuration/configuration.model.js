const database = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const configurationSchema = new database.Schema(
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
);

/**
 * For more information about how this plugin replace methods,
 * go to: https://www.npmjs.com/package/mongoose-delete#method-overridden
 */
configurationSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = database.model('Configuration', configurationSchema);
