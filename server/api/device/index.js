const Device = require('./device.controller');

module.exports = (app) => {
  app
    .get('/api/Devices', Device.Find)
    .post('/Device', Device.Create)
    .put('/Device', Device.Modify)
    .delete('/Device/:id', Device.Delete);
};
