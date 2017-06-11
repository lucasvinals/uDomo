// Require config,  sensors path
// Execute python or js to get all values,
// response

// var serverCode      = require('../../config/sensors').jsDummy;
// var serverSensor    = require(serverCode.dir + serverCode.fileName + serverCode.extension);
//
// var pythonShell     = require('python-shell');
// var sensor          = new pythonShell(   serverCode.dir +
//                                        serverCode.fileName +
//                                        serverCode.extension,
//                                        {mode: 'json'}
// );

const Promise = require('bluebird');
/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Sensors');
const respondWithResult = require('../handlers').respondWithResult('Sensors');

module.exports = {
  GetValue: (request, response) =>
    new Promise((fullfill, reject) => {
      const value = true;
      return value ? fullfill() : reject(new Error(''));
    })
    .then(respondWithResult(response))
    .catch(errorHandler(response)),
};
