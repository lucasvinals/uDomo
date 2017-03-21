const Backup = require('./backup.controller');

module.exports = (app) => {
  app
    .get('/api/backups', Backup.Find)
    .post('/backup', Backup.Create)
    .put('/backup', Backup.Restore)
    .delete('/backup/:id', Backup.Delete);
};
