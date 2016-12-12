const started           = Date.now();
const morgan            = require('morgan')('dev');
const compression       = require('compression')();
const crypto            = require('crypto');
const fs                = require('fs');
const io                = require('socket.io')();
const sioAdapter        = require('socket.io-adapter-mongo');
const methodOverride    = require('method-override')('X-HTTP-Method-Override');
let express             = require('express');
let app                 = express();
let bodyParser          = require('body-parser');
let log                 = process.log;
let wsModules           = [];

/**
 * Loads all the scripts in 'app/websockets'
 */
fs.readdir(__dirname + '/app/websockets', (e, files) => {
    files.forEach((file, index) => {
        wsModules[index] = require('./app/websockets/' + file.substring(0, file.indexOf('.js')));
    });
});

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
     * Accept only application/x-www-form-urlencoded and any type of values (like JSON)
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
    .use(express.static(__dirname + '/udomo'));

/**
 * Se setea la clave 'JWT_SECRET' para usar en las autenticaciones
 */
crypto.randomBytes(64, function(err, buffer) {
    process.env.JWT_SECRET = buffer.toString('base64');
});

/**
 * RESTful API
 */
fs.readdir(__dirname + '/app/REST', (e, files) => {
    files.forEach((file) => {
        require('./app/REST/' + file.substring(0, file.indexOf('.js')))(app);
    });
});

/**
 * Frontend Routes
 * Cuando tenga NGINX funcionando, ésto se tiene que sacar.
 */
app.use('/',(request, response) => {
    response.sendFile(__dirname + '/udomo/views/index.html');
});

module.exports = (args) => {
    /**
     * Cluster (2 or more cores activated): 
     *      Express instanece listening on local port,do not expose to outside.
     * Server (1 core): 
     *      Express instance listening in the given port, listen there.
     *
     * The server on the main process manage the connections with the clients.
     */
    const server  = app.listen(args.serverPort, process.env.clusterIP);
    /*
     * Socket.IO attached to Express instance 
     */
    io.attach(server);

    /**
     * Websockets
     */
    
    /**
     * Store sessions in db 
     */
    io.adapter(sioAdapter(process.env.MongoURL));
    /**
     * Prevent EventEmmiter memory leak
     */
    io.sockets.setMaxListeners(0);
    /**
     * Init ws modules in 'app/websockets'
     */
    wsModules.forEach((wsMod) => {
        wsMod(io);
    });

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
    process.on('uncaughtException', (err) => { log.error(err.stack); });

    /**
     * Log server info
     */
    log.info('\n> New instance of Server with PID ' + process.pid + 
            ' started in ' + (Date.now() - started) + 'ms.');
};
