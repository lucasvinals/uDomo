/**
 *  Database parameters
 */
const port = '12079';
const dbName = 'uDomo';
const secret = '3ud-!AMDepHhemCPh*n#'; // Change this to a different secret string!

class databaseParams {
    constructor(os) {
        this.url = "mongodb://127.0.0.1:" + port + "/" + dbName;
        this.dbPort = "--port=" + port; // 'mongod' listening port // URL access
        this.extras = "--smallfiles --logappend"; // Useful extras
        this.secret = secret;

        switch (os) {
            case 'linux':
                /**
                 * Binary path where mongod is located
                 */
                this.binaryPath = "/usr/bin/mongod";
                /**
                 * Where database is saved, DO NOT forget the simple quotes.
                 */
                this.storage = "--dbpath='/home/pi/uDomo/db/data/db'";
                /**
                 * Where database logs are saved, DO NOT forget the simple quotes.
                 */
                this.defaultLog = "--logpath='/home/pi/uDomo/db/logs/log.txt'";
            break;
            case 'windows':
                this.binaryPath = "C:/'Archivos de programa'/MongoDB/Server/3.2/bin/mongod.exe ";
                this.storage = "--dbpath=C:/Users/Lucas/Desktop/uDomo/db/data/db ";
                this.defaultLog = "--logpath=C:/Users/Lucas/Desktop/uDomo/db/logs/log.txt ";
            break;
        };
    }
}

module.exports = (os) => { return new databaseParams(os); };