const Promise = require('bluebird');
const { spawn: Bash } = require('child_process');
const uuid = require('uuid/v4');
const { port: dbPort } = require('../../config/db')();
const { log } = process;
const { get } = require('lodash');
const backupsDir = `${ process.ROOTDIR }/server/backups/`;
const Backup = require('./backup.model');
const removePhysicalBackup = require('../../tools/remove-files');

/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Backups');
const respondWithResult = require('../handlers').respondWithResult('Backups');

const Backups = {
  Find: (request, response) =>
    Backup
      .find({})
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),

  Create: (request, response) => {
    const fecha = new Date();
    const now = fecha.toLocaleString(
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
    const relPath = now.replace(' ', '_').replace(/[:/]/g, '-').replace(',', '');
    const directory = `${ backupsDir }${ relPath }`;

    return new Promise((fullfill, reject) => {
      /**
      * First, create a directory for the backup.
      * '-p' option creates a directory if no exists (recursivelly) and doesn't if already exists.
      */
      const { stderr: mkdirError } = Bash('mkdir', [ '-p', `${ directory }` ]);
      if (mkdirError.toString() !== '') {
        return reject(new Error(`Could not create the directory ${ directory } due to: ${ mkdirError }`));
      }
      /**
       * Then, execute 'mongodump' to create the backup in that directory.
       */
      const { stderr: mongodumpError } = Bash('$(which mongodump)', [ `${ dbPort }`, '--out', `${ directory }`, '/' ]);
      return mongodumpError.toString() === '' ?
        fullfill(() => {
          log.success(`The backup has been created in "${ directory }".`);
          return true;
        }) :
        reject(new Error(`mongodump failed due to: ${ mongodumpError.toString() }`));
    })
    .then(() =>
      Backup.create(
        {
          _id: uuid(),
          Name: now,
          Date: fecha,
          Pathname: relPath,
        }
      )
    )
    .then(respondWithResult(response))
    .catch(errorHandler(response));
  },
  Restore: (request, response) => {
    new Promise((fullfill, reject) => {
      const pathName = get(request, 'body.pathName', null);
      if (pathName === null) {
        return reject(new Error('There must be a relative directory path.'));
      }
      const directory = `${ backupsDir }${ pathName }`;
      const { stderr } = Bash('$(which mongorestore)', [ `${ dbPort }`, `${ directory }`, '/', '--objcheck' ]);
      return stderr.toString() === '' ?
        fullfill(/* Should return the name?*/) :
        reject(new Error(`Something happened restoring the database backup from "${ directory }`));
    })
    .then(respondWithResult(response))
    .catch(errorHandler(response));
  },
  Delete: (request, response) =>
    Backup
      .findByIdAndRemove(get(request, 'params.id', null))
      .exec()
      .then(log.success)
      .then(respondWithResult(response))
      .then((backup) => backup.Pathname)
      .then(removePhysicalBackup)
      .catch(errorHandler(response)),
};

module.exports = Backups;
