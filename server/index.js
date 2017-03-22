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

function uDomoModules(path) {
  return new Promise((resolve, reject) =>
    fileSystem.readdir(
      `${ String(__dirname) }${ path }`,
      (fsError, modules) => {
        if (fsError) {
          return reject(new Error(fsError));
        }
        return resolve(
          modules
            .filter((mod) => !mod.includes('handlers'))
            .map(
              (module) => {
                return {
                  initWith: req(`.${ path }/${ module }`),
                  filename: module,
                };
              }
            )
        );
      }
    )
  );
}

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
  .use(express.static(`${ process.ROOTDIR }/udomo`));

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

function init(args) {
  /**
   * Cluster (2 or more cores activated):
   *      Express instanece listening on local port,do not expose to outside.
   * Server (1 core):
   *      Express instance listening in the given port, listen there.
   *
   * The server on the main process manage the connections with the clients.
   */
  const server = app.listen(args.serverPort, process.clusterHost);
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
   * Init modules in 'server/api'
   */
  uDomoModules('/api')
    .then((modules) => {
      /**
       * Init all modules with Express and SocketIO
       */
      modules.map((module) => module.initWith(app, socketio));
      /**
       * Later, when I have time, define API routes and require each index (module.filename)
       * Frontend routes, send index.html on every request
       */
      // modules.map((module) => {
      //   app.use(module.filename, require(`./server/api/${ module.filename }`));
      // });
      app.use((request, response) => {
        response.sendFile(`${ process.ROOTDIR }/udomo/views/index.html`);
      });
    })
    .catch((ModuleError) => process.log.error(`Error ocurred loading modules: ${ ModuleError }`));

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
