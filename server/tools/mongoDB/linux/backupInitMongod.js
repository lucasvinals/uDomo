/**
 * Shell commands.
 */
const execFile = Promise.promisify(require('child_process').execFile);
/**
 * Database configurations
 */
const database = require('./server/config/db');
process.MongoURL = database.url;
/**
 * Init redis-server
 * Further application restarts get the same instance
 * Redis is awesome!
 */
function initRedis() {
  return execFile('redis-server', [ '--daemonize yes' ]);
}
/**
 * Shutdown mongod process
 */
function killMongoDB(previousError) {
  if (previousError) {
    process.log.error(`Something happened previously: ${ previousError }`);
  }

  return execFile(
    `${ database.binary }`,
    [
      '--dbpath',
      `${ database.storage }`,
      '--shutdown',
    ]
  );
}
/**
 * Repair mongod database directory
 */
function repairMongoDB() {
  return execFile(
    `${ database.binary }`,
    [
      '--repair',
      '--dbpath',
      `${ database.storage }`,
    ]
  );
}
/**
 * Init the MongoDB engine.
 * @returns {Function}
 */
function initMongoDB() {
  process.log.info('> Initializing database engine...');
  /**
   * Options descriptions:
   * --smallfiles: Use a smaller file size.
   * --logappend: Append new logs instead of replacing the old one.
   * --fork: Create a child process and exit parent.
   * With --fork option, mongod exits clean and the callback reaches a result!
   */
  return execFile(
    `${ database.binary }`,
    [
      '--dbpath',
      `${ database.storage }`,
      '--logpath',
      `${ database.defaultLog }`,
      '--port',
      `${ clusterPort + 1 }`,
      '--smallfiles',
      '--logappend',
      '--fork',
    ],
    {
      /**
       * If the mongod service didn't start in
       * [timeout] milliseconds, throw an error.
       */
      timeout: 15000,
    }
  )
    .then(() => database.url);
}
function normalInit() {
  /**
   * If it's master:
   * (1) Init the mongod process with params.
   * (2) Connect to the recently created database engine.
   * (3) If development, seed the database with dummy data.
   * (4) Init the master process.
   */
  return checkCorrectNumberOfCores()
    .then(initRedis)
    /**
     * If it's the 'local' environment, start mongod in place and seed database.
     * If not, then continue with normal master process initialization.
     */
    .then(() => {
      if (process.env.NODE_ENV === 'local') {
        return initMongoDB()
          .then(seedDatabase);
      }
      return true;
    })
    .then(spawnMaster);
}

if (cluster.isMaster) {
  normalInit()
    /**
     * If an error has occured in LOCAL environment:
     * (1) Kill (shutdown) the running instance of mongod.
     * (2) Repair the database.
     * (3) Retry normal workflow.
     */
    .catch(() => process.env.NODE_ENV !== 'local' || killMongoDB()
      .then(repairMongoDB)
      .then(normalInit)
    )
    /**
     * If some error is unrecoverable, kill the application.
     */
    .catch(killServer);
} else {
  /**
   * Spawn the server listening to the main connection.
   */
  childServer({ 'serverPort': 0 });
}
