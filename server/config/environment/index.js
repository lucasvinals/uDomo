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

module.exports = merge(
  require('./shared'),
  require(`./${ process.env.NODE_ENV }`)
);
