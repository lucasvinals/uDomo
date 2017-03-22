const Route = require('./route.model');
/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Routes');
const respondWithResult = require('../handlers').respondWithResult('Routes');

const Routes = {
  Find: (request, response) =>
    Route
      .find({})
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
};

module.exports = Routes;
