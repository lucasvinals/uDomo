const merge = require('lodash/merge');
const commonConfigurations = {
  ARG_CPU_NUMBER: 3,
  DEFAULT_CLUSTER_PORT: 8080,
};
const also = require(`./${ process.environment }`);
module.exports = merge(commonConfigurations, also);
