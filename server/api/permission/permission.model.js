const database = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const permissionSchema = new database.Schema(
  {
    _id: String,
    Name: String,
    Configuration: [ { type: String, ref: 'Configuration' } ],
  }
);

/**
 * For more information about how this plugin replace methods,
 * go to: https://www.npmjs.com/package/mongoose-delete#method-overridden
 */
permissionSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = database.model('Permission', permissionSchema);
