const Zone = require('./zone.model');
const Device = require('../device/device.model');
const { log } = process;
const { get } = require('lodash');
const { statusPhrasesToCodes: httpCodes } = require('know-your-http-well');

/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Zones');
const respondWithResult = require('../handlers').respondWithResult('Zones');

const Zones = {
  /**
   * Find Zones
   */
  Find: (request, response) =>
    Zone
      .find()
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response, httpCodes.NOT_FOUND)),
  /**
   * Create Zone
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
      .then(respondWithResult(response, httpCodes.CREATED))
      .catch(errorHandler(response, httpCodes.CONFLICT)),

  /**
   * Modify Zone
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
   * Delete Zone
   */
  Delete: (request, response) =>
    Zone
      .findOne({ _id: get(request, 'params.id', null) })
      .exec()
      .then((zone) => {
        Device
          .find()
          .populate('Zone')
          .exec()
          .then(log.warning);
          // .remove({ [Zone._id]: _.get(zone, '_id', null) });

        return zone;
      })
      .then((zone) => zone.remove())
      .then(respondWithResult(response))
      .catch(errorHandler(response, httpCodes.PRECONDITION_FAILED)),
};

module.exports = Zones;
