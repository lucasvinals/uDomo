const Configuration = require('./configuration.model');
const { log } = process;
const { get } = require('lodash');
/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Configurations');
const respondWithResult = require('../handlers').respondWithResult('Configurations');

const Configurations = {
  FindOne: (request, response) =>
    Configuration
      .findOne({ _id: get(request, 'params.id', null) })
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  FindAll: (request, response) =>
    Configuration
      .find()
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  Create: (request, response) =>
    Configuration
      .findOne({ Name: get(request, 'body.Name', null) })
      .exec()
      .then((foundConf) => {
        if (foundConf) {
          log.error(`The configuration ${ foundConf.Name } is already saved.`);
          return null;
        }
        return Configuration
          .create(get(request, 'body', {}))
          .then((configuration) => log.success(`The configuration ${ configuration.Name } was created.`));
      })
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
};

module.exports = Configurations;
