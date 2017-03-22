const Permission = require('./permission.model');
/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Permissions');
const respondWithResult = require('../handlers').respondWithResult('Permissions');

const Permissions = {
  Find: (request, response) =>
    Permission
      .find({})
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
};

module.exports = Permissions;
