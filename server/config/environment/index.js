const { merge } = require('lodash');
const { execSync } = require('child_process');
/**
 * Get the main app path
 */
process.ROOTDIR = execSync(
  `${ process.platform === 'linux' ? 'realpath' : 'cd' } .`)
  .toString()
  .replace('\n', '')
  .trim();
/**
 * Set the environment with CLI option or 'development'
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = merge(
  require('./shared'),
  require(`./${ process.env.NODE_ENV }`)
);
