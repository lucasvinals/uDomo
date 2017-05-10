const started = Date.now();
/**
 * Command line '--' style arguments
 */
const { argv } = require('optimist');
/**
 * Shell commands.
 */
const { execFile } = require('child_process');
/**
 * Common config
 */
const { DEFAULT_CLUSTER_PORT } = require('./server/config/environment');
/**
 * Libraries
 */
const cluster = require('cluster');
const net = require('net');
const { times, repeat } = require('lodash');
const mongoose = require('mongoose');
const Promise = require('bluebird');
/**
 * Set mongoose default Promise library to bluebird,
 * this prevents the mongo mpromise deprecation message
 */
mongoose.Promise = Promise;
/**
 * How many cores are available?
 */
const machineCPUs = Number(require('os').cpus().length);
/**
 * If '-cores' option is passed, then set them accordingly,
 * if not, then use all cores available.
 */
const numProcesses = Number(argv.c) || machineCPUs;
/**
 * Custom log, with colours.
 * Could be replaces with a library, but this works well.
 */
process.log = require('./server/tools/logger')(process.env.NODE_ENV);
/**
 * If current network IP address is needed,
 * replace 'localhost' with:
 * require('./tools/getip')(process.platform);
 */
process.clusterHost = 'localhost';
/**
 * Set the application port
 */
process.clusterPort = Number(argv.p) || DEFAULT_CLUSTER_PORT;
/**
 * Database configurations
 */
const database = require('./server/config/db');
process.MongoURL = database.url;
/**
 * Server to spawn numProcesses times.
 */
const childServer = require('./server');
/**
 * Seed the database with dummy data for testing
 * (development only)
 */
const seedDatabase = require('./server/seed');
/**
 * Array containing devices.
 * Maybe in the near future this will be deprecated.
 */
process.devices = [];
/**
 * If an unrecoverable error occurs,
 * kill the process.
 */
function killServer() {
  return process.kill(process.pid);
}
/**
 * Shutdown mongod process
 */
function killMongoDB(previousError) {
  if (previousError) {
    process.log.error(`Something happened previously: ${ previousError }`);
  }

  return Promise.promisify(execFile)(
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
  return Promise.promisify(execFile)(
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
  return Promise.promisify(execFile)(
    `${ database.binary }`,
    [
      '--dbpath', `${ database.storage }`,
      '--logpath', `${ database.defaultLog }`,
      '--port', `${ database.port }`,
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
/**
 * Connect to mongod running database.
 * @param {String} url
 */
function connectToMongoDB(url) {
  return mongoose.connect(url, { server: { reconnectTries: Number.MAX_VALUE } });
}
/**
 * Get a number from 1 to numProcesses accordingly to the IP.
 * Same worker given the same IP address.
 */
function getWorkerIndex(ipAddress, threads) {
  return 1 + (Number(ipAddress.replace(/\D+/g, '')) % threads);
}

/**
 *  Check if numProcess has a valid number to spawn workers
 */
function checkCorrectNumberOfCores() {
  return new Promise((fullfill, reject) => {
    function message() {
      /* eslint-disable */
      process.log.error(
        `${ repeat('*', 10) }
        You can't run cluster with ${ numProcesses } spawn processes.
        Please give a valid number from 1 to ${ machineCPUs })
        ${ repeat('*', 10) }`.replace(/\s+/g, ' ').trim()
      );
      /* eslint-enable */
    }

    return (numProcesses < 1 || numProcesses > machineCPUs) ?
      message() && reject(new Error(`Invalid number of cores: ${ numProcesses }`)) :
      fullfill();
  })
  .catch(killServer);
}

/**
 * Init the master process.
 */
function spawnMaster() {
  /**
   * If has only one core, launch a standalone server.
   */
  if (numProcesses === 1) {
    return childServer({ 'serverPort': process.clusterPort });
  }
  /**
   * Spawn workers by numProcesses.
   */
  times(numProcesses, () => cluster.fork());
  /**
   * Set a proxy array keeping reference from original workers
   * This is because id of cluster.workers will increment if a
   * worker died and the respawn another.
   */
  const { workers } = cluster;
  /**
   * Add listener to log when a worker exits or died
   * Then, respawn a worker.
   */
  cluster
    .on('exit', (worker, code, signal) => {
      process.log.warning(
        `Worker ${ worker.id } with PID ${ worker.process.pid }
        died. Signal ${ signal }. Code: ${ code }`.replace(/\s+/g, ' ').trim()
      );

      if (worker.exitedAfterDisconnect === false && signal !== 'SIGINT') {
        process.log.warning('The worker died unexpectedly. Respawning worker...');
        workers[worker.id] = cluster.fork();
      }
    })
    .on('disconnect', () => {
      killMongoDB().then(process.log.warning('Database engine closed.'));
    });
  /**
   * Create the outside facing server listening on process.clusterPort
   */
  return net
  .createServer({ pauseOnConnect: true })
  .on('connection', (connection) => {
    /**
     * Received a connection and need to pass it to the appropriate worker.
     * Get the worker for this connection's source IP and send it the connection.
     */
    const ipAddress = connection.remoteAddress;
    const index = getWorkerIndex(ipAddress, numProcesses);
    workers[index].send('uDomoNewConnection', connection);
  })
  .listen(process.clusterPort, () => {
    process.log.info(
      `\n> New instance of Master with PID ${ process.pid } started in ${ (Date.now() - started) } ms.`
      .replace(/\s+/g, ' ')
      .trim()
    );
  });
}

/**
 * Normal workflow to start the cluster.
 */
function normalInit() {
  /**
   * If it's master:
   * (1) Init the mongod process with params.
   * (2) Connect to the recently created database engine.
   * (3) If development, seed the database with dummy data.
   * (4) Init the master process.
   */
  return checkCorrectNumberOfCores()
    .then(initMongoDB)
    .then(connectToMongoDB)
    .then(seedDatabase)
    .then(spawnMaster);
}

if (cluster.isMaster) {
  normalInit()
    /**
     * An error has occured, so:
     * (1) Kill (shutdown) the running instance of mongod.
     * (2) Repair the database.
     * (3) Retry normal workflow.
     */
    .catch(() =>
      killMongoDB()
        .then(repairMongoDB)
        .then(normalInit)
    )
    /**
     * If some error is unrecoverable, kill the application.
     */
    .catch(killServer);
} else {
  /**
   * Spanw the server listening to the main connection.
   */
  childServer({ 'serverPort': 0 });
}
