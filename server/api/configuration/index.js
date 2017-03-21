const Configuration = require('./configuration.controller');

module.exports = (app) => {
  app
    .get('/api/Configurations', Configuration.Find)
    .post('/Configuration', Configuration.Create);
};
