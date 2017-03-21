const { spawnSync: Bash } = require('child_process');

function platformConfig() {
  return process.platform === 'linux' ? //eslint-disable-line
  {
    /**
     * Location of mongod.
     */
    binary: Bash('which', [ 'mongod' ]).stdout.toString().trim(),
    /**
     * Database directory.
     */
    storage: `${ '--dbpath' }=/root/uDomo/server/db/data/db/`,
    /**
     * Database logs directory.
     */
    defaultLog: `${ '--logpath' }=/root/uDomo/server/db/logs/log.txt`,
  } :
  process.platform === 'windows' ?
  {
    /**
     * Location of mongod.
     */
    binary: 'mongod',
    /**
     * Database directory.
     */
    storage: '--dbpath=C:/Users/Lucas/Desktop/uDomo/server/db/data/db',
    /**
     * Database logs directory.
     */
    defaultLog: '--logpath=C:/Users/Lucas/Desktop/uDomo/server/db/logs/log.txt',
  } :
  {};
}

function DatabaseParams() {
  const port = process.clusterPort + 1;
  const dbName = 'uDomo';
  const config = platformConfig();

  return {
    /**
     * URL to connect with mongod engine
     */
    url: `mongodb://127.0.0.1:${ port }/${ dbName }`,
    /**
     * 'mongod' port listening incomming connections
     */
    port: `--port=${ port }`,
    /**
     * Extra database's engine commands
     */
    smallfiles: '--smallfiles',
    logappend: '--logappend',
    binary: config.binary,
    storage: config.storage,
    defaultLog: config.defaultLog,
  };
}

module.exports = DatabaseParams;
