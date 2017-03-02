const Promise = require('es6-promise').Promise;
const Bash = require('shelljs').exec;
const uuid = require('uuid/v4');
const dbPort = require('../../cluster').MongoPort;
const log = process.log;
const httpCodes = require('know-your-http-well').statusPhrasesToCodes;
const backupsDir = `${ process.ROOTDIR }/uDomo/backups/`;
const Backup = require('../models/backups');
const removeFiles = require('../../tools/remove-files');

const Backups = {
  Find: (findCallback) => {
    Backup.find((findError, backs) => {
      if (findError) {
        log.error('Something happened retrieving content of backups directory');
        return findCallback(findError, []);
      }
      return findCallback(null, backs);
    });
  },
  Create: (createCallback) => {
    function saveBackupData(backupData, saveCallback) {
      new Backup(backupData)
        .save((saveError, response) =>
          ((saveError && saveCallback(saveError, false)) || saveCallback(null, response)));
    }

    /**
     * New dates for Argentina
     * Change if you're in another country
     */
    const fecha = new Date();
    const now = fecha.toLocaleString(
      'es-AR',
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
    /**
     * First, create a directory for the backup.
     * '-p' option creates a directory if no exists (recursivelly) and doesn't if already exists.
     */
    Bash(`mkdir -p ${ directory }`, { silent: true });
    /**
     * Then, execute 'mongodump' to create the backup in that directory.
     */
    Bash(`$(which mongodump) ${ dbPort } --out ${ directory }/`,
        { silent: true },
        (code, stdout, stderr) => {
          if (code === 0) {
            log.success(`The backup has been created in "${ directory }".`);
            saveBackupData(
              {
                _id: uuid(),
                Name: now,
                Date: fecha,
                Pathname: relPath,
              },
              (errorSaving, saved) =>
                ((errorSaving && createCallback(errorSaving, false)) || createCallback(null, saved)));
          } else {
            log.error(`Something happened creating the new database backup in "${ directory }".`);
            log.error(`stderr: ${ stderr }`);
            createCallback(stderr, false);
          }
        });
  },
  Restore: (pathName, restoreCallback) => {
    const directory = `${ backupsDir }${ pathName }`;
    Bash(`$(which mongorestore) ${ dbPort } ${ directory }/ --objcheck`, { silent: true },
        (code, stdout, stderr) => {
          if (code === 0) {
            log.success(`The database has been restored from the backup in "${ directory }".`);
            restoreCallback(null, true);
          } else {
            log.error(`Something happened restoring the database backup from "${ directory }".`);
            log.error(`stderr: ${ stderr }`);
            restoreCallback(stderr, false);
          }
        });
  },
  Delete: (id, deleteCallback) => {
    /**
     * Remove the folders inside backupsDir
     */
    removeFiles(backupsDir);
    /**
     * Then find and remove the register
     * in the database.
     */
    Backup.findOne({ _id: id }).remove((deleteError, deleted) => {
      if (deleteError) {
        log.error(`The backup ${ id } has not been deleted due to this error -> ${ deleteError }`);
        return deleteCallback(deleteError, {});
      }
      return deleteCallback(deleteError, deleted);
    });
  },
};

module.exports = (app) => {
  app
      .get('/api/backups', (request, response) =>
          Backups.Find((findError, backs) => response.json({ Error: findError, Backups: backs }))
      )
      .post('/backup', (request, response) => {
        function Create() {
          return new Promise((fullfill, reject) =>
            Backups.Create((createError, created) =>
                (createError !== null && reject(createError)) || fullfill(created)));
        }

        Create()
          .then((created) => response.status(httpCodes.OK).json({ Error: null, Created: created }))
          .catch((rejectError) =>
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({ Error: rejectError, Created: false }));
      })
      .put('/backup', (request, response) => {
        function Restore() {
          return new Promise((fullfill, reject) =>
            Backups.Restore(request.body.pathName, (restoreError, restored) =>
                ((restoreError !== null || !restored) && reject(restoreError)) || fullfill(restored)));
        }

        Restore()
          .then((restored) => response.status(httpCodes.OK).json({ Error: null, Restored: restored }))
          .catch((restoreError) =>
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({ Error: restoreError, Restored: false }));
      })
      .delete('/backup/:id', (request, response) => {
        function Delete() {
          return new Promise((resolve, reject) =>
            Backups.Delete(request.params.id, (deleteError, deleted) =>
                (deleteError !== null && reject(deleteError)) || resolve(deleted)));
        }

        Delete()
          .then((deleted) => response.status(httpCodes.OK).json({ Error: null, Deleted: deleted }))
          .catch((deleteError) =>
            response.status(httpCodes.INTERNAL_SERVER_ERROR).json({ Error: deleteError, Deleted: false }));
      });
};
