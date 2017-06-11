const httpStatus = require('http-status');

function respondWithResult(name) {
  return (response, statusCode) =>
    (entity) => {
      response
        .status(statusCode ? statusCode : httpStatus.OK)
        .json({ [name ? name : 'Result']: entity, 'Error': null });
      return entity;
    };
}

function errorHandler(name) {
  return (response, statusCode) =>
    (errorStack) =>
      response
        .status(statusCode ? statusCode : httpStatus.INTERNAL_SERVER_ERROR)
        .json({ [name ? name : 'Result']: null, 'Error': errorStack });
}

module.exports = {
  errorHandler,
  respondWithResult,
};
