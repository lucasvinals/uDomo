const started           = Date.now();
const cluster           = require('cluster');
const bashCommand       = require('shelljs').exec;
const machineCPUs       = require('os').cpus().length;
const operatingSystem   = 'linux';
const numProcesses      = process.argv[3] || machineCPUs;
const log               = process.log = require('./tools/logger')('server');
const db                = require('./config/db')(operatingSystem);
const mongoose          = require('mongoose');
const net               = require('net');
process.env.clusterPort = process.argv[2] || 80;
process.env.clusterIP   = require('./tools/getIP')(operatingSystem);
process.env.MongoURL    = db.url;
process.devices         = [];

let killServer = () => {
    process.kill(process.pid);
}

/**
 *  Check if numProcess has a valid number to spawn workers and if has only one core,
 *  launch a standalone server
 */
if(numProcesses < 1 || numProcesses > machineCPUs){
    log.error(Array(65).join('*') +
                 '\nYou can\'t run cluster with' + numProcesses + ' spawn processes.\
                 \nPlease give a valid number (1 - ' +
                 machineCPUs +
                 ')' +
                 Array(31).join(' ') +
                 '\n'.toUpperCase() +
                 Array(65).join('*')
                );
    killServer();
}

if (cluster.isMaster) { // Master
    /**
     * Initialize the database engine inside the master, easy to install in the future
     */
    let     countError      = 0;

    /**
     * Kill mongod process (with it's PID) -> (SIGTERM) if found. Since it's a fast and
     * simple command, it can be synchonous
     */
    let killMongoInstance = (kmi = () => {
        if(bashCommand(
                        'kill $(($(ps -C mongod | grep mongod | cut -c 1-5)))',
                        {silent: true}).code == 0){
            /**
             * Successfully closed an instance of MongoDB
             */
            log.warning('> Se terminó una instancia de \"mongod\" abierta.');
        }
        return kmi;
    })();

    let initMongoInstance = (initMongo = () => {
        log.info('> Iniciando el motor de base de datos...');
        bashCommand("mongod --repair " + db.storage, {silent: true});
        /**
         * From: "https://www.npmjs.com/package/shelljs" (80% page) 10/07/2016:
         * "For long-lived processes, it's best to run exec() asynchronously as the current
         * synchronous implementation uses a lot of CPU. This should be getting fixed soon."

         *  Necesitaría que ésto sea síncrono pero que se ejecute LUEGO de killMongoInstance
         *   Creo que al ser asíncrono (o muy rápido) no le da tiempo a mongod para iniciar
         *   de nuevo.. un timeout a initMongo no me sirvió...
         */
        bashCommand(
            db.binaryPath + ' ' +
            db.storage + ' ' +
            db.defaultLog + ' ' +
            db.dbPort + ' ' +
            db.extras,
            {silent: true},
            (code, stdout, stderr) => {
                if(code != 0){
                    log.warning( '> Error en el inicio de la base de datos.' +
                                    '\nSe intenta terminar con alguna instancia de ' +
                                    '\"mongod\" abierta'
                               );
                    /**
                     * Execute again the mongod killer
                     */
                    killMongoInstance();
                    ++countError < 3 ?
                        /**
                         * Recursive call the inner function
                         */
                        initMongo() :
                        /**
                         * If fails, do not start the cluster/server
                         */
                        killServer();
                }
            }
        );
        log.success('> El motor de base de datos se inició correctamente!');
        return initMongo;
    })();

    /**
     * Connect to the MongoDB engine
     */
    mongoose.connect(process.env.MongoURL);

    /**
     * If numProcesses is 1, then it will only run in one core,
     * so trigger once the server and leave cluster
     */
    if(numProcesses == 1){
        require('./server')({"serverPort": process.env.clusterPort});
        return;
    }

    /** This stores the workers. Need to keep them to be able to reference them based on
      * source IP address
      */
    let workers = [];
    let spawn   = (i) => {
        'use strict';
        workers[i] = cluster.fork()
            /**
             * Inform that the worker died on exit and then respawn it.
             */
            .on('exit', (worker, code, signal) => {
                'use strict';
                log.warning('\n> Worker '+ i + ' died with code ' + code +
                                ' and signal ' + signal + ' .Respawning worker ' + i);
                spawn(i);
            });
    };

    /**
     * Spawn (init) workers.
     */
    for (let i = numProcesses; --i;) { spawn(i); }

    /**
     * Get a number from 1 to (numProcesses - 1) accordingly to the given IP
     */
    let getWorkerIndex = (ip, cantHilos) => {
        'use strict';
        let s = '';
        for (let i = 0, ipSize = ip.length; i < ipSize; ++i) {
            if (ip[i] !== '.' && ip[i] !== ':' && !isNaN(ip[i])) {
                s += ip[i];
            }
        }
        /*
         * parseInt because IPv6 is formatted in hexadecimal
         */
        return 1 + (parseInt(s, 16) % (cantHilos - 1));
    }

    /**
     * Create the outside facing server listening on PORT
     */
    net.createServer({ pauseOnConnect: true }, (connection) => {
        'use strict';
        /**
         * Received a connection and need to pass it to the appropriate worker.
         * Get the worker for this connection's source IP and pass it the connection.
         */
        let ip = connection.remoteAddress;
        let worker = workers[getWorkerIndex(ip, numProcesses)];

        worker.send('sticky-session:connection', connection);
        log.info('\n> New Connection! Remote Address: ' + ip +
                    ' assigned to worker N° ' + getWorkerIndex(ip, numProcesses)
                    );
    }).listen(process.env.clusterPort);

    log.info('\n> New instance of Master with PID ' + process.pid +
                    ' started in ' + (Date.now() - started) + 'ms.');
} else { // Spawn workers
    require('./server')({"serverPort": 0});
}
