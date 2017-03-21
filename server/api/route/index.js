const Route = require('./route.controller');

module.exports = (app) => {
  app
    .get('/api/Routes', Route.Find);
};
