const User = require('./user.model');
const { sign: CreateToken } = require('jsonwebtoken');
const { entrophy } = require('../../config/environment');
const { get } = require('lodash');
const Promise = require('bluebird');
const httpStatus = require('http-status');
/**
 * Handlers with entity's name
 */
const errorHandler = require('../handlers').errorHandler('Users');
const respondWithResult = require('../handlers').respondWithResult('Users');

const Users = {
  /**
   * Get one user
   */
  FindOne: (request, response) =>
    User
      .findOne({ _id: get(request, 'params.id', null) })
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  /**
   * Get all users
   */
  FindAll: (request, response) =>
    User
      .find()
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  /**
   * Create an user
   */
  Create: (request, response) => {
    const Username = get(request, 'body.Username', null);
    const Password = get(request, 'body.Password', null);
    return User
      .findOne({ Username, Password })
      .exec()
      .then((foundUser) => {
        if (foundUser) {
          return null;
        }
        return User
          .create(get(request, 'body', {}))
          .then((newUser) => {
            newUser.Token = CreateToken(newUser, entrophy);
            return newUser.save();
          });
      })
      .then(respondWithResult(response))
      .catch(errorHandler(response));
  },
  /**
   * Modify an user
   */
  Modify: (request, response) =>
    User
      .findByIdAndUpdate(get(request, 'body._id', null), get(request, 'body', {}))
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  /**
   * Delete an user
   */
  Delete: (request, response) =>
    User
      .delete({ '_id': get(request, 'params.id', null) })
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
};

// app.use((request, response, next) => {
//    response.setHeader('Access-Control-Allow-Origin', '*');
//    response.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
//    next();
// });

const Login = {
  Authenticate: (request, response) => {
    const { Password, Username } = get(request, 'body', {});
    return User
      .findOne({ Username, Password })
      .exec()
      .then((foundUser) => {
        if (!foundUser) {
          return null;
        }
        return CreateToken(foundUser, entrophy, { expiresInMinutes: 1440 });
      })
      .then(respondWithResult(response))
      .catch(errorHandler(response));
  },
  Me: (request, response) =>
    User
      .findOne({ Token: get(request, 'body.Token', null) })
      .exec()
      .then(respondWithResult(response))
      .catch(errorHandler(response)),
  EnsureAuthorized: (request, response, next) =>
    new Promise((fullfill, reject) => {
      const bearerHeader = request.headers.authorization;
      return bearerHeader ?
        fullfill(() => {
          const [ , token ] = bearerHeader.split(' ');
          request.Token = token;
          return next();
        }) :
        reject(httpStatus.FORBIDDEN);
    })
    .then(respondWithResult(response))
    .catch(errorHandler(response)),
};

module.exports = {
  Login,
  User: Users,
};
