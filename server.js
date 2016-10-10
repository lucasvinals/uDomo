const started     = Date.now();

module.exports = (serverPort, log, serverOS) => {
    /**
     * Connect the MongoDB engine with Node.
     */
    const mongoDB = require('./config/db')(serverOS).url;
    require('mongoose').connect(mongoDB);

    let express         = require('express');
    let app             = express();
    let bodyParser      = require('body-parser'); // Work with JSON in application

    /**
     * App configuration
     */
    app
        /**
         * Compress using gzip
         */
        .use(require('compression')())
        /**
         * Log HTTP Requests
         */
        .use(require('morgan')('dev'))
        /**
         * Override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
         */
        .use(require('method-override')('X-HTTP-Method-Override'))
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
    require('crypto').randomBytes(64, function(err, buffer) {
        process.env.JWT_SECRET = buffer.toString('base64');
    });

    const fs = require('fs');

    /**
     * RESTful API
     */
    fs.readdirSync(__dirname + '/app/REST').forEach((file) => {
        require('./app/REST/' + file.substring(0, file.indexOf('.js')))(app, log);
    });

    /**
     * Frontend Routes
     */
    app.use('/',(request, response) => {
        response.sendFile(__dirname + '/udomo/views/index.html');
    });

    /**
     * Cluster (2 or more cores activated): 
     *      Express instanece listening on local port,do not expose to outside.
     * Server (1 core): 
     *      Express instance listening in the given port, listen there.
     *
     * The server on the main process manage the connections with the clients.
     */
    const ipServer = require('./tools/getIP')(serverOS);
    const server  = app.listen(serverPort, ipServer);
    /* Socket.IO attached to Express instance */
    const io      = require('socket.io')(server);

    /**
     * Websockets
     */
    
    /**
     * Store sessions in db 
     */
    io.adapter(require('socket.io-adapter-mongo')(mongoDB));
    /**
     * Prevent EventEmmiter memory leak
     */
    io.sockets.setMaxListeners(0);
    /**
     * Loads all the scripts in 'app/websockets'
     */
    fs.readdirSync(__dirname + '/app/websockets').forEach((file) => {
        require('./app/websockets/' + file.substring(0, file.indexOf('.js')))(io, log);
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
    process.on('uncaughtException', (err) => { log.error(err); });

    /**
     * Log server info
     */
    log.info('\n> New instance of Server with PID ' + process.pid + 
            ' started in ' + (Date.now() - started) + 'ms.');
};
