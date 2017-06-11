const { User, Login } = require('./user.controller');

module.exports = (router) =>
  router
    .get('/:id', User.FindOne)
    .get('/', User.FindAll)
    .get('/me', Login.EnsureAuthorized, Login.Me)
    .post('/', User.Create)
    .post('/authenticate', Login.Authenticate)
    .put('/', User.Modify)
    .delete('/:id', User.Delete);
