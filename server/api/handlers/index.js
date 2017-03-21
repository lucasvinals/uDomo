const httpCodes = require('know-your-http-well').statusPhrasesToCodes;

function respondWithResult(name) {
  return (response, statusCode) =>
    (entity) => {
      response
        .status(statusCode ? statusCode : httpCodes.OK)
        .json({ [name ? name : 'Result']: entity, 'Error': null });
      return entity;
    };
}

function errorHandler(name) {
  return (response, statusCode) =>
    (errorStack) =>
      response
        .status(statusCode ? statusCode : httpCodes.INTERNAL_SERVER_ERROR)
        .json({ [name ? name : 'Result']: null, 'Error': errorStack });
}

module.exports = {
  errorHandler,
  respondWithResult,
};
