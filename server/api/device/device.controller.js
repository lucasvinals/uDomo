const Device = require('./device.model');
const { log } = process;
const { get, merge, set, find } = require('lodash');
/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Device');
const respondWithResult = require('../handlers').respondWithResult('Device');

const Devices = {
  Find: (request, response) =>
    Device
      .find({})
      .exec()
      .then((devices) => merge(process.devices, devices))
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  Create: (request, response) =>
    Device
      .findOne({ _id: get(request, 'body._id', null) })
      .exec()
      .then((foundDevice) => {
        if (foundDevice) {
          return null;
        }
        return Device
          .create(get(request, 'body', {}))
          .then((devCreated) => log.success(`Device ${ devCreated.Name } created`));
      })
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  Modify: (request, response) =>
    Device
      .findByIdAndUpdate(get(request, 'body._id', null), get(request, 'body', {}))
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  Delete: (request, response) =>
    Device
      .findByIdAndRemove(get(request, 'params.id', null))
      .exec()
      // .then(log.warning)
      /**
       * Once the device is deleted,
       * set the property 'Saved' to false
       *
       * Emit an event instead and remove via ws???
       */
      .then((devDeleted) =>
        set(
          find(
            process.devices,
            { _id: get(devDeleted, '_id', null) }
          ),
          'Saved',
          false
        )
      )
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
};

module.exports = Devices;
