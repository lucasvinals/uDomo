const Device = require('./device.model');
const { log } = process;
const { get, merge } = require('lodash');
/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Devices');
const respondWithResult = require('../handlers').respondWithResult('Devices');

const Devices = {
  FindOne: (request, response) =>
    Device
      .findOne({ _id: get(request, 'params.id', null) })
      .exec()
      .then((devices) => merge(process.devices, devices))
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  FindAll: (request, response) =>
    Device
      .find()
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
      .delete({ '_id': get(request, 'params.id', null) })
      .exec()
      .then(Device.updateSavedTo(false))
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
};

module.exports = Devices;
