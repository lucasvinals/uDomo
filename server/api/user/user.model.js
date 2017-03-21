const database = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const userSchema = new database.Schema(
  {
    _id: String,
    Token: String,
    Name: String,
    Age: Number,
    Username: String,
    Email: String,
    Password: String,
    Permission: [ { type: String, ref: 'Permission' } ],
  }
);

/**
 * For more information about how this plugin replace methods,
 * go to: https://www.npmjs.com/package/mongoose-delete#method-overridden
 */
userSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

module.exports = database.model('User', userSchema);
