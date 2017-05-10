const Route = require('./route.controller');

module.exports = (router) =>
  router
    .get('/', Route.FindAll);
