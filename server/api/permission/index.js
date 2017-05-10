const Permission = require('./permission.controller');

module.exports = (router) =>
  router
    .get('/:id', Permission.FindOne)
    .get('/', Permission.FindAll);
