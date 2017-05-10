const Backup = require('./backup.model');
const { promisify: Promisify } = require('bluebird');
const { execFile } = require('child_process');
const uuid = require('uuid/v4');
const { get } = require('lodash');
const { port } = require(`${ process.ROOTDIR }/server/config/environment`);
const backupsDir = `${ process.ROOTDIR }/server/backups/`;
const removePhysicalBackup = require(`${ process.ROOTDIR }/server/tools/remove-files`);

/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Backups');
const respondWithResult = require('../handlers').respondWithResult('Backups');

/**
 * Create a directory in the specified directory.
 * @param {String} directory
 */
function createDirectory(directory) {
  return Promisify(execFile)(
    'mkdir',
    [
      '-p',
      `${ directory }`,
    ],
    { timeout: 3000 }
  )
    .then(() => directory)
    .catch((mkdirError) => new Error(`Could not create the directory ${ directory } due to: ${ mkdirError }`));
}

/**
 * Create a database dump of the current state.
 * @param {number} dbPort
 * @returns {Function}
 */
function mongoDump(dbPort) {
  return (directory) => Promisify(execFile)(
    '$(which mongodump)',
    [
      '--port',
      `${ dbPort }`,
      '--out',
      `${ directory }`,
    ]
  ).catch((mongoDumpError) => new Error(`mongodump command failed due to: ${ mongoDumpError.toString() }`));
}

/**
 * Restore a database dump of a previous state.
 * @param {number} dbPort
 * @returns {Function}
 */
function mongoRestore(dbPort) {
  return (directory) => Promisify(execFile)(
    '$(which mongorestore)',
    [
      '--port',
      `${ dbPort }`,
      `${ directory }`,
      '/',
      '--objcheck',
    ]
  ).catch(new Error(`Something happened restoring the database backup from "${ directory }"`));
}

const Backups = {
  /**
   * Find a backup
   */
  FindOne: (request, response) =>
    Backup
      .findById(get(request, 'params.id', null))
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  /**
   * Retrieve all backups
   */
  FindAll: (request, response) =>
    Backup
      .find()
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),

  Create: (request, response) => {
    const fecha = new Date();
    const Name = fecha.toLocaleString(
      /**
       * Default timezone to Argentina
       */
      get(request, 'body.timezone', 'es-AR'),
      {
        hour12: false,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        second: '2-digit',
        minute: '2-digit',
        hour: '2-digit',
      });
    /**
     * A more convinient name for the directory
     */
    const Pathname = Name.replace(' ', '_').replace(/[:/]/g, '-').replace(',', '');
    /**
     * (1) Create a directory for the backup.
     * '-p' option creates a directory if no exists (recursivelly) and doesn't if already exists.
     * (2) Create a database dump.
     * (3) Save register of the backup to the database.
     * (4) Handle result.
     */
    createDirectory(`${ backupsDir }${ Pathname }`)
      .then(mongoDump(port))
      .then(Backup.create({ _id: uuid(), Date: fecha, Name, Pathname }))
      .then(respondWithResult(response))
      .catch(errorHandler(response));
  },
  /**
   * Restore previously saved backup
   */
  Restore: (request, response) =>
    mongoRestore(port)(`${ backupsDir }${ get(request, 'body.pathName') }`)
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  /**
   * Delete a backup
   */
  Delete: (request, response) =>
    Backup
      .delete({ '_id': get(request, 'params.id', null) })
      .exec()
      .then(respondWithResult(response))
      .then((backup) => backup.Pathname)
      .then(removePhysicalBackup)
      .catch(errorHandler(response)),
};

module.exports = Backups;
