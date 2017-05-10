const Zone = require('./zone.controller');

module.exports = (router) =>
  router
    .get('/:id', Zone.FindOne)
    .get('/', Zone.FindAll)
    .post('/', Zone.Create)
    .put('/', Zone.Modify)
    .delete('/:id', Zone.Delete);
