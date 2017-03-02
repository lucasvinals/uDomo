const fileSystem = require('fs');
const check = require('syntax-error');
const tester = require('glob');
const log = require('../tools/logger')('server');

function checkSyntaxis() {
  /**
   * Server
   */
  log.info('Checking server files for syntax errors');
  const serverArray = [
    './app/**/*.*',
    './config/*.*',
    './*.js',
    './sensors/**/*.js',
    './tests/**/*.js',
    './tools/**/*.js',
  ];
  serverArray.forEach((pattern) => {
    tester.sync(pattern).forEach((file) => {
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
  tester.sync('./client/js/**/*.js').forEach((file) => {
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
}

module.exports = () => checkSyntaxis();
