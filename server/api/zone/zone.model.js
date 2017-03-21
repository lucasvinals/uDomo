const database = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const zoneSchema = new database.Schema(
  {
    _id: String,
    Name: String,
    Created: Date,
  }
);

/**
 * For more information about how this plugin replace methods,
 * go to: https://www.npmjs.com/package/mongoose-delete#method-overridden
 */
zoneSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = database.model('Zone', zoneSchema);
