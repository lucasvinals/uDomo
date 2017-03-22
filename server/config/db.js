const { spawnSync: Bash } = require('child_process');
const { merge } = require('lodash');
const port = process.clusterPort + 1;

const linux = {
  /**
   * Location of mongod.
   */
  binary: Bash('which', [ 'mongod' ]).stdout.toString().trim(),
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

function platformSpecific() {
  return process.platform === 'linux' ? //eslint-disable-line
    linux :
    process.platform === 'windows' ?
      windows :
      {};
}

module.exports = merge(
  {
    url: `mongodb://127.0.0.1:${ port }/uDomo`,
    port,
  },
  platformSpecific()
);
