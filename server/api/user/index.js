const { User, Login } = require('./user.controller');

module.exports = (app) => {
  app
    /**
     * User endpoints
     */
    .get('/api/Users', User.Find)
    .post('/User', User.Create)
    .put('/User', User.Modify)
    .delete('/User/:id', User.Delete)
    /**
     * Login endpoints
     */
    .get('/Me', Login.EnsureAuthorized, Login.Me)
    .post('/Authenticate', Login.Authenticate);
};
