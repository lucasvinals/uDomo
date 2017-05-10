const Backup = require('./backup.controller');

module.exports = (router) =>
  router
    .get('/:id', Backup.FindOne)
    .get('/', Backup.FindAll)
    .post('/', Backup.Create)
    .put('/', Backup.Restore)
    .delete('/:id', Backup.Delete);
