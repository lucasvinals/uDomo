const started = Date.now();
const morgan = require('morgan')('dev');
const compression = require('compression')();
const crypto = require('crypto');
const { readdirSync, existsSync } = require('fs');
const socketio = require('socket.io')();
const sioRedis = require('socket.io-redis');
const methodOverride = require('method-override')('X-HTTP-Method-Override');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const httpStatus = require('http-status');
const connectDatabase = require('./tools/connectToMongoDB.js');
const req = require;

function LoadModules(relPath) {
  const path = `${ process.ROOTDIR }/server/${ relPath }`;
  return readdirSync(path)
    .filter((module) => module !== 'handlers')
    .map((module) => {
      const submodule = `${ path }/${ module }`;
      /**
       * Set module name
       */
      const moduleFiles = { name: module };
      /**
       * Load declarated REST modules
       */
      if (existsSync(`${ submodule }/index.js`)) {
        Object.assign(moduleFiles, { rest: req(`${ submodule }/index.js`) });
      }
      /**
       * Load declarated websockets modules
       */
      if (existsSync(`${ submodule }/${ module }.websocket.js`)) {
        Object.assign(moduleFiles, { ws: req(`${ submodule }/${ module }.websocket.js`) });
      }
      return moduleFiles;
    });
}

const uDomoModules = LoadModules('api');

/**
 * Express configuration
 */
app
  /**
   * Protect agains well-known web vulnerabilities
   */
  .use(helmet())
  /**
   * Compress using gzip
   */
  .use(compression)
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

if (process.env.NODE_ENV === 'development') {
  /**
   * Log HTTP Requests in console
   */
  app.use(morgan);
}
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

function init({ serverPort }) {
  /**
   * Cluster (2 or more cores activated):
   *      Express instanece listening on local port,do not expose to outside.
   * Server (1 core):
   *      Express instance listening in the given port, listen there.
   *
   * The server on the main process manage the connections with the clients.
   */
  const server = app.listen(serverPort, process.clusterHost);
  /**
   * Socket.IO attached to Express instance
   */
  socketio.attach(server);
  /**
   * Store sessions in db
   */
  socketio.adapter(sioRedis());
  /**
   * Prevent EventEmmiter memory leak
   */
  socketio.sockets.setMaxListeners(0);
  /**
   *  Emulate a connection event on the server by emitting the event with
   *  the connection the master sent us.
   */
  process.on('message', (event, connection) => {
    if (event === 'uDomoNewConnection') {
      process.log.info(`\n> New connection from IP: ${ connection.remoteAddress }`);
      server.emit('connection', connection);
      connection.resume();
    }
  });

  /**
   * If an error occurs, log it. I think this is not the best option,
   * but for now works. Should be Winston, Trace,etc...?
   */
  process.on('uncaughtException', (uncaughtError) =>
    process.log.error(`An error has occurred ${ uncaughtError.stack }`)
  );

  try {
    uDomoModules.map((module) => {
      /**
       * Define the /api/[method], require corresponding module and init.
       * Once Express 5.0 is stable, change Express Router intance for app.router
       */
      app.use(`/api/${ module.name }`, module.rest(express.Router({ mergeParams: true })));
      /**
       * Init websockets modules
       */
      if (module.ws) {
        module.ws(socketio, module.name);
      }
      return module;
    });
    /**
     * Don't allow these routes
     */
    app.route('/:url(auth|components|app|bower_components|assets)/*', (request, response) => {
      response.sendStatus(httpStatus.METHOD_NOT_ALLOWED);
    });
    /**
     * On other requests, send index.html.
     */
    app.get('*', (request, response) =>
      response.sendFile('index.html', { root: `${ process.ROOTDIR }/udomo/views` })
    );
    /**
     * Error handler listener for client error catching.
     */
    app.post('/api/log', (request, response) => {
      process.log.error(request.body);
      return response.status(httpStatus.OK).send('Error logged in server\'s console');
    });
    /**
     * Connect to database engine
     */
    connectDatabase();
  } catch (exception) {
    process.log.error(`Error ocurred loading modules: ${ exception }`);
  }
  /**
   * Log server info
   */
  process.log.info(
    `\n> New instance of Server with PID ${ process.pid } started in ${ (Date.now() - started) } ms.`
  );
}

module.exports = init;
