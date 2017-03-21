const database = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const routeSchema = new database.Schema(
  {
    _id: String,
    relPath: String,
    filePath: String,
    controller: String,
  }
);

/**
 * For more information about how this plugin replace methods,
 * go to: https://www.npmjs.com/package/mongoose-delete#method-overridden
 */
routeSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = database.model('Route', routeSchema);
