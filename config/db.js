const { spawnSync: Bash } = require('child_process');
/**
 *  Database parameters
 */
const port = process.clusterPort + 1;
const dbName = 'uDomo';
/**
 * Change this to a different secret string!
 */
const secret = '3ud-!AMDepHhemCPh*n#';

class DatabaseParams {
  /**
   *
   * @param {The operating system configuration. GNU/Linux by default} operatingSystem
   */
  constructor(operatingSystem = 'linux') {
    this.url = `mongodb://127.0.0.1:${ port }/${ dbName }`;
    /**
     * 'mongod' port listening incomming connections
     */
    this.port = `--port=${ port }`;
    /**
     * Extra database's engine commands
     */
    this.smallfiles = '--smallfiles';
    this.logappend = '--logappend';
    this.secret = secret;

    switch (operatingSystem) {
      case 'linux':
        this.binary = Bash('which', [ 'mongod' ]).stdout.toString().trim();
        /**
         * Where database is saved, DO NOT forget the simple quotes.
         */
        this.storage = '--dbpath="/root/uDomo/db/data/db"';
        /**
         * Where database logs are saved, DO NOT forget the simple quotes.
         */
        this.defaultLog = '--logpath="/root/uDomo/db/logs/log.txt"';
        break;
      case 'windows':
        this.storage = '--dbpath=C:/Users/Lucas/Desktop/uDomo/db/data/db';
        this.defaultLog = '--logpath=C:/Users/Lucas/Desktop/uDomo/db/logs/log.txt';
        break;
      default:
        break;
    }
  }
}

module.exports = (operatingSystem) => new DatabaseParams(operatingSystem);
