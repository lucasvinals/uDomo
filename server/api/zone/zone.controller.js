const Zone = require('./zone.model');
const Device = require('../device/device.model');
const { get } = require('lodash');
const httpStatus = require('http-status');
/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Zones');
const respondWithResult = require('../handlers').respondWithResult('Zones');

const Zones = {
  /**
   * Find a zone
   */
  FindOne: (request, response) =>
    Zone
      .findOne({ _id: get(request, 'params.id', null) })
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response, httpStatus.NOT_FOUND)),
  /**
   * Find zones
   */
  FindAll: (request, response) =>
    Zone
      .find()
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response, httpStatus.NOT_FOUND)),
  /**
   * Create zone
   */
  Create: (request, response) =>
    Zone
      .findOne({ Name: get(request, 'body.Name', '') })
      .exec()
      .then((foundZone) => {
        if (foundZone) {
          throw new Error(`The zone with name ${ foundZone.Name } already exists!`);
        }
        return Zone
          .create(get(request, 'body', {}));
      })
      .then(respondWithResult(response, httpStatus.CREATED))
      .catch(errorHandler(response, httpStatus.CONFLICT)),

  /**
   * Modify zone
   */
  Modify: (request, response) =>
    Zone
      .findByIdAndUpdate(
        get(request, 'body._id', null),
        get(request, 'body', {}),
        { new: true }
      )
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),

  /**
   * Delete zone
   */
  Delete: (request, response) =>
    Zone
      .findOne({ _id: get(request, 'params.id', null) })
      .exec()
      .then((zone) => {
        Device
          .delete({ '_id': get(request, 'params.id', null) })
          .exec()
          .then(Device.updateSavedTo(false));

        return zone;
      })
      .then((zone) => zone.delete())
      .then(respondWithResult(response))
      .catch(errorHandler(response, httpStatus.PRECONDITION_FAILED)),
};

module.exports = Zones;
