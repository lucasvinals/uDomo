const Permission = require('./permission.model');
const { get } = require('lodash');

/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Permissions');
const respondWithResult = require('../handlers').respondWithResult('Permissions');

const Permissions = {
  FindOne: (request, response) =>
    Permission
      .findOne({ _id: get(request, 'params.id', null) })
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  FindAll: (request, response) =>
    Permission
      .find()
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
};

module.exports = Permissions;
