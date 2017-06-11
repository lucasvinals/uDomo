const { merge } = require('lodash');
const { execFileSync } = require('child_process');
const port = process.clusterPort + 1;
const binary = execFileSync('which', [ 'mongod' ]).toString().replace('\n', '').trim();

const linux = {
  /**
   * Location of mongod.
   * In case it's not in the PATH environment variable.
   */
  binary,
  /**
   * Database directory.
   */
  storage: `${ process.ROOTDIR }/server/db/data/db/`,
  /**
   * Database logs directory.
   */
  defaultLog: `${ process.ROOTDIR }/server/db/logs/log.txt`,
};

const windows = {
  /**
   * Location of mongod.
   */
  binary: 'mongod',
  /**
   * Database directory.
   */
  storage: 'C:/Users/Lucas/Desktop/uDomo/server/db/data/db',
  /**
   * Database logs directory.
   */
  defaultLog: 'C:/Users/Lucas/Desktop/uDomo/server/db/logs/log.txt',
};

function platformSpecific({ platform } = process) {
  return {
    linux,
    windows,
  }[platform] || {};
}

module.exports = merge(
  {
    url: `mongodb://127.0.0.1:${ port }/uDomo`,
    port,
  },
  platformSpecific()
);
