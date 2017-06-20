const defaultPort = 12078;

module.exports = {
  serverSensors: {
    python: '',
    javascript: '',
  },
  clusterPort: process.env.CLUSTER_PORT || defaultPort,
  ssl: {
    cert: `${ process.ROOTDIR }/server/ssl/server.crt`,
    key: `${ process.ROOTDIR }/server/ssl/server.key`,
  },
};
