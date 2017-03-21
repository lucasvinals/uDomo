const database = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const backupSchema = new database.Schema(
  {
    _id: String,
    DisplayName: String,
    Pathname: String,
    Datetime: Date,
  }
);

/**
 * For more information about how this plugin replace methods,
 * go to: https://www.npmjs.com/package/mongoose-delete#method-overridden
 */
backupSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = database.model('Backup', backupSchema);
