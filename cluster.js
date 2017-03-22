const started = Date.now();
process.environment = 'development';
const { spawnSync, execSync } = require('child_process');
process.ROOTDIR = spawnSync(process.platform === 'linux' ? 'realpath' : 'cd', [ './' ]).stdout.toString().trim();
const { ARG_CPU_NUMBER, DEFAULT_CLUSTER_PORT } = require('./server/config/environment');
const cluster = require('cluster');
const net = require('net');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;
const machineCPUs = Number(require('os').cpus().length);
const numProcesses = Number(process.argv[ARG_CPU_NUMBER]) || machineCPUs;
const log = require('./server/tools/logger')('server');
process.log = log;
/**
 * If current network IP address is needed,
 * replace 'localhost' with:
 * require('./tools/getIP')(process.platform);
 */
process.clusterHost = 'localhost';
process.clusterPort = Number(process.argv[2]) || DEFAULT_CLUSTER_PORT;
const database = require('./server/config/db');
process.MongoURL = database.url;
const { init: serverFork } = require('./server');
const seedDatabase = require('./server/seed');
process.devices = [];

function killServer() {
  return process.kill(process.pid);
}

/**
 * Shutdown mongod process
 */
function killMongoDB(previousError) {
  if (previousError) {
    log.error(`Something happened previously: ${ previousError }`);
  }

  return new Promise((fullfill, reject) => {
    const { stderr } = spawnSync(`${ database.binary }`, [ `${ database.storage }`, '--shutdown' ]);
    if (!stderr.toString()) {
      return fullfill();
    }
    return reject(new Error(`Killing mongod instance failed with error code ${ stderr.toString() }`));
  });
}

function repairMongoDB() {
  return new Promise((fullfill, reject) => {
    const { stderr } = spawnSync(`${ database.binary }`, [ '--repair', `${ database.storage }` ]);
    return stderr.toString() ?
      fullfill() :
      reject(new Error(`Reparing mongod instance failed with error: ${ stderr.toString() }`));
  })
  .then(() => log.warning('Successfully repaired the database engine. You should start the server again.'))
  .catch((repairError) => new Error(`Repair database engine failed due to: ${ repairError }`));
}

function initMongoDB() {
  log.info('> Initializing database engine...');
  return new Promise((fullfill, reject) => {
    execSync(`
      ${ database.binary }
      --dbpath ${ database.storage }
      --logpath ${ database.defaultLog }
      --port ${ database.port }
      --smallfiles --logappend &`.trim(),
      {
        detached: true,
        stdio: 'ignore',
      }
    );
    /**
     * I know this is not good, but can't think another way
     * to spawn a mongod process and make it run.
     */
    return fullfill(database.url);
  });
}

function connectToMongoDB(url) {
  return mongoose.connect(
    url,
    {
      promiseLibrary: Promise,
      server: { reconnectTries: Number.MAX_VALUE },
    }
  );
}

function spawnMaster() {
  /**
   *  Check if numProcess has a valid number to spawn workers
   */
  if (numProcesses < 1 || numProcesses > machineCPUs) {
    /**
     * ESLint throws 'no magin number'
     */
    const firstSpace = 52;
    const secondSpace = 10;
    log.error(`${ Array(firstSpace).join('*') }
    You can't run cluster with ${ numProcesses } spawn processes. 
    Please give a valid number (1 - ${ machineCPUs })${ Array(secondSpace).join(' ') }\
    \n${ Array(secondSpace).join('*') }`);
    killServer();
  }

  /**
   * if has only one core, launch a standalone server.
   */
  if (numProcesses === 1) {
    return serverFork({ 'serverPort': process.clusterPort });
  }

  /**
   * This stores the workers. Need to keep them to be able to reference them based on
   * source IP address
   */
  const workers = [];
  function forkCluster(index) {
    workers[index] = cluster.fork()
        /**
         * Inform that the worker died on exit and then respawn it.
         */
        .on('exit', (worker, code) => {
          log.warning(`\n>Worker ${ index } died with code ${ code } \
          and signal $ { signal }.\
          Respawning worker ${ index }`);
          forkCluster(index);
        });
  }

  /**
   * Spawn (init) workers.
   */
  for (let index = numProcesses; --index;) {
    forkCluster(index);
  }

  /**
   * Get a number from 1 to (numProcesses - 1) accordingly to the given IP
   */
  function getWorkerIndex(ipAddress, cantHilos) {
    let ipString = '';
    for (let index = 0, ipSize = ipAddress.length; index < ipSize; ++index) {
      if (ipAddress[index] !== '.' && ipAddress[index] !== ':' && !isNaN(ipAddress[index])) {
        ipString += ipAddress[index];
      }
    }
    /**
     * parseInt because IPv6 is formatted in hexadecimal
     */
    return 1 + (parseInt(ipString, 16) % (cantHilos - 1));
  }

  /**
   * Create the outside facing server listening on PORT
   */
  net.createServer({ pauseOnConnect: true }, (connection) => {
    /**
     * Received a connection and need to pass it to the appropriate worker.
     * Get the worker for this connection's source IP and pass it the connection.
     */
    const ipAddress = connection.remoteAddress;
    const worker = workers[getWorkerIndex(ipAddress, numProcesses)];

    worker.send('sticky-session:connection', connection);
    log.info(
      [
        '\n',
        '> New Connection! Remote Address:',
        ipAddress,
        'assigned to worker N°',
        getWorkerIndex(ipAddress, numProcesses),
      ].join(' ')
    );
  }).listen(process.clusterPort);

  return log.info(`\n> New instance of Master with PID ${ process.pid } started in ${ (Date.now() - started) } ms.`);
}

if (cluster.isMaster) {
  /**
   * Can't init mongodb engine directly
   * This should run smoothly
   */
  initMongoDB()
    .then(connectToMongoDB)
    .then(seedDatabase)
    .then(spawnMaster)
    .catch(killMongoDB)
    .catch(repairMongoDB)
    .catch(killServer);
} else {
  serverFork({ 'serverPort': 0 });
}
