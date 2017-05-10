const Sensor = require('./sensor.controller');

module.exports = (router) =>
  router
    .post('/', Sensor.GetValue);
