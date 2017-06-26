const { merge } = require('lodash');
const { realpathSync } = require('fs');
/**
 * Get the main app path
 */
process.ROOTDIR = realpathSync('../../../');
/**
 * Set the environment with CLI option or 'development'
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = merge(
  require('./shared'),
  require(`./${ process.env.NODE_ENV }`)
);
