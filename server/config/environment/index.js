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
 * Read the environment file or set NODE_ENV to 'development'
 */
process.env.NODE_ENV = process.env.NODE_ENV ||
                       execSync(`cat ${ process.ROOTDIR }/environment`).toString().replace('\n', '') ||
                       'development';

module.exports = merge(
  {
    DEFAULT_CLUSTER_PORT: 12078,
  },
  require(`./${ process.env.NODE_ENV }`));
