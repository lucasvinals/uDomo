const Permission = require('./permission.model');
/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Permission');
const respondWithResult = require('../handlers').respondWithResult('Permission');

const Permissions = {
  Find: (request, response) =>
    Permission
      .find({})
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
};

module.exports = Permissions;
