const { execFileSync } = require('child_process');
const { mongo } = require('./environment');

function getBinary(searchWith = 'which') {
  return execFileSync(searchWith, [ 'mongod' ]).toString().replace('\n', '').trim();
}

const binaryIn = {
  linux: () => getBinary('which'),
  windows: () => getBinary('where'),
};

module.exports = {
  /**
   * URL to connect to mongo
   */
  url: mongo.url,
  /**
   * Database directory.
   */
  storage: `${ process.ROOTDIR }/server/db/data/db/`,
  /**
   * Database logs directory.
   */
  defaultLog: `${ process.ROOTDIR }/server/db/logs/log.txt`,
  /**
   * Mongod binary
   */
  binary: binaryIn[process.platform] ? binaryIn[process.platform]() : getBinary(),
};
