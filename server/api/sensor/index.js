const Sensor = require('./sensor.controller');

module.exports = (app) => {
  app.post('/api/Sensor', Sensor.GetValue);
};
