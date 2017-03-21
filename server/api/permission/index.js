const Permission = require('./permission.controller');

module.exports = (app) => {
  app
    .get('/api/Permissions', Permission.Find);
};
