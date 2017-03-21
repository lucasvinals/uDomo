const fileSystem = require('fs-extra');
const Promise = require('es6-promise');
const { log } = process;

function removePromise(path) {
  return new Promise((resolve, reject) => {
    fileSystem.remove(path, (removeError) => {
      if (removeError) {
        return reject(removeError);
      }
      return resolve(path);
    });
  })
  .then(() => log.success(`Content of ${ path } successfully removed`))
  .catch((removeError) => log.error(`Error occurred removing content of ${ path }: ${ removeError }`));
}

module.exports = removePromise;
