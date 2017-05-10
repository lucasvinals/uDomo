const Device = require('./device.controller');

module.exports = (router) =>
  router
    .get('/:id', Device.FindOne)
    .get('/', Device.FindAll)
    .post('/', Device.Create)
    .put('/', Device.Modify)
    .delete('/:id', Device.Delete);
