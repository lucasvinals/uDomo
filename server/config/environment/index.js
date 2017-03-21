const { merge } = require('lodash');

module.exports = merge(
  {
    ARG_CPU_NUMBER: 3,
    DEFAULT_CLUSTER_PORT: 8080,
  },
  require(`./${ process.environment }`));
