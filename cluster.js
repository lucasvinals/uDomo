const started = Date.now();
const cluster = require('cluster');
const Bash = require('shelljs').exec;
const machineCPUs = Number(require('os').cpus().length);
const ARG_CPU_NUMBER = 3;
const numProcesses = Number(process.argv[ARG_CPU_NUMBER]) || machineCPUs;
const log = require('./tools/logger')('server');
process.log = log;
const mongoose = require('mongoose');
const net = require('net');
const Promise = require('es6-promise').Promise;
mongoose.Promise = Promise;
process.operatingSystem = 'linux';
const database = require('./config/db')(process.operatingSystem);
const DEFAULT_CLUSTER_PORT = 8080;
process.clusterPort = Number(process.argv[2]) || DEFAULT_CLUSTER_PORT;
process.clusterIP = require('./tools/getIP')(process.operatingSystem);
process.MongoURL = database.url;
process.ROOTDIR = Bash((() => {
  const path = process.operatingSystem === 'linux' ?
    'realpath ./' :
    'cd';
  return path;
})(), { silent: true }).stdout.trim();
const serverFork = require('./server').init;
process.devices = [];

function killServer() {
  return process.kill(process.pid);
}

function spawnMaster() {
  /**
   *  Check if numProcess has a valid number to spawn workers and if has only one core,
   *  launch a standalone server
   */
  if (numProcesses < 1 || numProcesses > machineCPUs) {
    /**
     * Hate when ESLint throws 'no magin number'
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
   * Kill mongod process (with it's PID) -> (SIGTERM) if found. Since it's a fast and
   * simple command, it can be synchonous
   */
  function killMongoDB(previousError) {
    if (previousError) {
      log.error(`Something happened previously: ${ previousError }`);
    }

    return new Promise((fullfill, reject) => {
      const code = Bash('killall mongod').code;
      return code === 0 || code === 1 ?
        fullfill() :
        reject(new Error(`Killing mongod instance failed with error code ${ code }`));
    });
  }

  function repairMongoDB() {
    return new Promise((fullfill, reject) => {
      const code = Bash(`$(which mongod) --repair ${ database.storage }`, { silent: true }).code;
      return code === 0 ?
        fullfill() :
        reject(new Error(`Reparing mongod instance failed with error code ${ code }`));
    });
  }

  function initMongoDB() {
    return new Promise((fullfill, reject) => {
      log.info('> Init database engine...');
      return Bash(
        [
          Bash('which mongod', { silent: true }).trim(),
          database.storage,
          database.defaultLog,
          database.dbPort,
          database.extras,
        ].join(' '),
      { silent: true },
      (code, stdout, stderr) => {
        const result = code === 0 ?
          fullfill(database.url) :
          reject(
            new Error(
              `Init mongod instance failed with
               error code ${ code } and 
               stderr: ${ stderr }`
            )
          );
        return result;
      });
    });
  }

  mongoose.connect(database.url);
  /**
   * Try to init mongod service.
   * HELP WANTED!
   * Cannot start the database engine here,
   * IDK why the Bash method initMongoDB promise
   * does not start the database.
   */
  // initMongoDB()
  //   .then(mongoose.connect)
  //   .catch((mongoError) => {
  //     log.error(mongoError);
  //     repairMongoDB()
  //       .then(() => {
  //         log.warning(`Successfully repaired the database engine.
  //         You should start the server again`);
  //       })
  //       .catch(killMongoDB);
  //   });

  /**
   * If numProcesses is 1, then it will only run in one core,
   * so trigger once the server and leave cluster
   */
  if (numProcesses === 1) {
    return serverFork({ 'serverPort': process.clusterPort });
  }

  /**
   * This stores the workers. Need to keep them to be able to reference them based on
   * source IP address
   */
  const workers = [];
  function spawn(i) {
    workers[i] = cluster.fork()
        /**
         * Inform that the worker died on exit and then respawn it.
         */
        .on('exit', (worker, code) => {
          log.warning(`\n>Worker ${ i } died with code ${ code } \
          and signal $ { signal }.\
          Respawning worker ${ i }`);
          spawn(i);
        });
  }

  /**
   * Spawn (init) workers.
   */
  for (let i = numProcesses; --i;) {
    spawn(i);
  }

  /**
   * Get a number from 1 to (numProcesses - 1) accordingly to the given IP
   */
  function getWorkerIndex(ipAddress, cantHilos) {
    let ipString = '';
    for (let i = 0, ipSize = ipAddress.length; i < ipSize; ++i) {
      if (ipAddress[i] !== '.' && ipAddress[i] !== ':' && !isNaN(ipAddress[i])) {
        ipString += ipAddress[i];
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
    log.info(`\n> 
    New Connection! Remote Address: ${ ipAddress }\ 
    assigned to worker N° ${ getWorkerIndex(ipAddress, numProcesses) }`);
  }).listen(process.clusterPort);

  return log.info(`\n> New instance of Master with PID ${ process.pid }\
  started in ${ (Date.now() - started) } ms.`);
}

if (cluster.isMaster) {
  spawnMaster();
} else {
  serverFork({ 'serverPort': 0 });
}

module.exports = { Promise, Bash, MongoPort: database.dbPort };
