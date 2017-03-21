const Route = require('./route.model');
/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Route');
const respondWithResult = require('../handlers').respondWithResult('Route');

const Routes = {
  Find: (request, response) =>
    Route
      .find({})
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
};

module.exports = Routes;
