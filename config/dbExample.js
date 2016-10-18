/**
 *  Define database parameters 
 */
const port = '12079';
const dbName = 'uDomo';
const secret = '3ud-!AMDepHhemCPh*n#'; // Change this to a different secret string!

class databaseParams {
    constructor(os) {
        this.url = "mongodb://127.0.0.1:" + port + "/" + dbName;
        this.dbPort = "--port=" + port + " "; // 'mongod' listening port // URL access
        this.extras = "--smallfiles --logappend"; // Useful extras
        this.secret = secret;

        switch (os) {
            case 'linux':
                /**
                 * Binary path where mongod is located
                 */
                this.binaryPath = "/usr/bin/mongod ";
                /**
                 * Where database is saved
                 */
                this.storage = "--dbpath='/home/pi/uDomo/db/data/db' ";
                /**
                 * Where logs are saved
                 */
                this.defaultLog = "--logpath='/home/pi/uDomo/db/logs/log.txt' ";
                break;
            case 'windows':
                this.binaryPath = "C:/'Archivos de programa'/MongoDB/Server/3.2/bin/mongod.exe ";
                this.storage = "--dbpath=C:/Users/LViñals/Desktop/uDomo/db/data/db ";
                this.defaultLog = "--logpath=C:/Users/LViñals/Desktop/uDomo/db/logs/log.txt ";
                break;
        };
    }
}

/** 
 * Meti mas variables para que sea mucho mas ordenado en cluster. 
 * Si se usa el sistema en linux, usar la keyword 'linux', de la misma forma para windows, arm, etc
 */
module.exports = (os) => {
    return new databaseParams(os);
};