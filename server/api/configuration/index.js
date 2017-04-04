const Configuration = require('./configuration.controller');

module.exports = (router) =>
  router
    .get('/:id', Configuration.FindOne)
    .get('/', Configuration.FindAll)
    .post('/', Configuration.Create);
