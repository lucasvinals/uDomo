const started = Date.now();
const { cpus } = require('os');

/**
 * Common config
 */
const { clusterPort, ssl } = require('./server/config/environment');
/**
 * Libraries
 */
const cluster = require('cluster');
const https = require('https');
const { times, repeat } = require('lodash');
const Promise = require('bluebird');
const { readFileSync } = require('fs');
/**
 * How many cores are available?
 */
const machineCPUs = Number(cpus().length);
/**
 * If '-cores' option is passed, then set them accordingly,
 * if not, then use all cores available.
 */
const numProcesses = Number(process.env.CORES) || machineCPUs;
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
process.clusterPort = Number(process.env.PORT) || clusterPort;
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
function killServer(killError) {
  process.log.error(`This error caused the server to be killed: ${ killError }`);
  return process.kill(process.pid);
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
      process.log.error(
        `${ repeat('*', Number('10')) }
        You can't run cluster with ${ numProcesses } spawn processes.
        Please give a valid number from 1 to ${ machineCPUs })
        ${ repeat('*', Number('10')) }`.replace(/\s+/g, ' ').trim()
      );
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
    .on('disconnect', () => process.log.warning('Cluster server disconnected!'));
  /**
   * Create the outside facing server listening on process.clusterPort
   */
  return https
    .createServer(
      {
        ca: readFileSync(ssl.ca),
        cert: readFileSync(ssl.cert),
        key: readFileSync(ssl.key),
        rejectUnauthorized: false,
        requestCert: true,
        timeout: 2000,
      }
    )
    .on('connection', (connection) => {
      connection.pause();
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
   * (1) Check for a correct number of cores if the user specified this.
   * (2) If local, seed the database with dummy data (seedDatabase).
   * (3) Init the master process.
   */
  return checkCorrectNumberOfCores()
    .then(seedDatabase)
    .then(spawnMaster);
}

if (cluster.isMaster) {
  /**
   * If something goes wrong, kill server
   */
  normalInit().catch(killServer);
} else {
  /**
   * Spawn the server listening to the main connection.
   */
  childServer({ 'serverPort': 0 });
}
