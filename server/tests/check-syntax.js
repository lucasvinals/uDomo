const fileSystem = require('fs');
const check = require('syntax-error');
const tester = require('glob');
const log = require('../tools/logger')('server');
const { partition, each } = require('lodash');

function checkSyntaxis(paths) {
  /**
   * Server
   */
  const [ clientPaths, serverPaths ] = partition(paths, (path) => path.includes('client'));
  log.info('Checking server files for syntax errors');
  each(serverPaths, (pattern) => {
    each(tester.sync(pattern), (file) => {
      fileSystem.readFile(file, (readError, fileContent) => {
        if (readError) {
          throw readError;
        }
        const serverFileError = check(fileContent);
        return serverFileError ?
          log.error(serverFileError) :
          log.success(`File: ${ file } -> Syntax OK`);
      });
    });
  });

  /**
   * Client
   */
  log.info('Checking client js files for syntax errors');
  each(clientPaths, (pattern) => {
    each(tester.sync(pattern), (file) => {
      fileSystem.readFile(file, (readError, fileContent) => {
        if (readError) {
          throw readError;
        }
        const clientFileError = check(fileContent);
        return clientFileError ?
          log.error(clientFileError) :
          log.success(`File: ${ file } -> Syntax OK`);
      });
    });
  });
}

module.exports = checkSyntaxis;
