const started = Date.now();
const morgan = require('morgan')('dev');
const compression = require('compression')();
const crypto = require('crypto');
const fileSystem = require('fs');
const socketio = require('socket.io')();
const sioAdapter = require('socket.io-adapter-mongo');
const methodOverride = require('method-override')('X-HTTP-Method-Override');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const req = require;

function uDomoPromise(path) {
  return new Promise((resolve, reject) => {
    const promiseModules = [];
    fileSystem.readdir(`${ String(__dirname) }${ path }`, (fsError, files) => {
      files.forEach((file, index) => {
        promiseModules[index] = req(`.${ path }${ file }`);
      });
      if (fsError) {
        return reject(fsError);
      }
      return resolve(promiseModules);
    });
  });
}

/**
 * Loads all the scripts in 'app/websockets'
 */
const wsResults = uDomoPromise('/app/websockets/');

/**
 * App configuration
 */
app
  /**
   * Compress using gzip
   */
  .use(compression)
  /**
   * Log HTTP Requests
   */
  .use(morgan)
  /**
   * Override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
   */
  .use(methodOverride)
  /**
   * Accept application/x-www-form-urlencoded and any type of values (like JSON)
   */
  .use(bodyParser.urlencoded({ extended: true }))
  /**
   * Parse application/json in request.body
   */
  .use(bodyParser.json())
  /**
   * Parse application/vnd.api+json as json
   */
  .use(bodyParser.json({ type: 'application/vnd.api+json' }))
  /**
   * Set the static files location. User will see --> /js , /css, etc .
   */
  .use(express.static(`${ String(__dirname) }/udomo`));

/**
 * Se setea la clave 'JWT_SECRET' para usar en las autenticaciones
 */
const cryptoMagicNumber = 64;
crypto.randomBytes(cryptoMagicNumber, (cryptoError, buffer) => {
  if (cryptoError) {
    throw cryptoError;
  }
  process.JWT_SECRET = buffer.toString('base64');
});

/**
 * RESTful API
 */
const RESTResults = uDomoPromise('/app/REST/');

function init(args) {
  /**
   * Cluster (2 or more cores activated):
   *      Express instanece listening on local port,do not expose to outside.
   * Server (1 core):
   *      Express instance listening in the given port, listen there.
   *
   * The server on the main process manage the connections with the clients.
   */
  const server = app.listen(args.serverPort, process.clusterIP);
  /*
    * Socket.IO attached to Express instance
    */
  socketio.attach(server);

  /**
   * Store sessions in db
   */
  socketio.adapter(sioAdapter(process.MongoURL));
  /**
   * Prevent EventEmmiter memory leak
   */
  socketio.sockets.setMaxListeners(0);
  /**
   * Init ws modules in 'app/websockets'
   */
  wsResults
    .then((modules) => modules.forEach((mod) => mod(socketio)))
    .catch((websocketError) =>
      process.log.error(new Error(`Error ocurred loading websockets modules: ${ JSON.stringify(websocketError) }`)));
  /**
   * Init REST modules in 'app/REST'
   */
  RESTResults
    .then((modules) => {
      modules.forEach((mod) => mod(app));
      /**
       * Frontend routes, send index.html on every request
       */
      app.use((request, response) => {
        response.sendFile(`${ String(__dirname) }/udomo/views/index.html`);
      });
    })
    .catch((RESTerror) => process.log.error(`Error ocurred loading REST modules: ${ JSON.stringify(RESTerror) }`));

  /**
   *  Emulate a connection event on the server by emitting the event with
   *  the connection the master sent us.
   */
  process.on('message', (message, connection) => {
    if (message === 'sticky-session:connection') {
      server.emit('connection', connection);
      connection.resume();
    }
  });

  /**
   * If an error occurs, log it
   */
  process.on('uncaughtException', (uncaughtError) =>
    process.log.error(`An error has occurred ${ uncaughtError.stack }`));

  /**
   * Log server info
   */
  process.log.info(`\n> New instance of Server with PID ${ process.pid } started in ${ (Date.now() - started) } ms.`);
}

module.exports = { init };
