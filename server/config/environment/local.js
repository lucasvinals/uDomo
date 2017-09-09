const { clusterPort } = require('./shared');

module.exports = {
  mongo: {
    url: `mongodb://127.0.0.1:${ clusterPort + 1 }/uDomo`,
  },
};
