const Zone = require('./zone.controller');

module.exports = (app) => {
  app
    .get('/api/zones', Zone.Find)
    .post('/zone', Zone.Create)
    .put('/zone', Zone.Modify)
    .delete('/zone/:id', Zone.Delete);
};
