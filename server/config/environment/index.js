const { merge } = require('lodash');
const { realpathSync } = require('fs');
/**
 * Get the main app path
 */
process.ROOTDIR = realpathSync('.');
/**
 * Set the environment. 'local' by default
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

/**
 * Set MongoDB port. 27017 by default.
 */
const DEFAULT_MONGODB_PORT = 27017;
process.env.MONGODB_PORT = process.env.MONGODB_PORT || DEFAULT_MONGODB_PORT;

module.exports = merge(
  require('./shared'),
  require(`./${ process.env.NODE_ENV }`)
);
