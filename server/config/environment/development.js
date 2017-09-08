/**
 * Username and password of remote Atlas database
 */
const USER = process.env.MONGODB_USER;
const PASSWORD = process.env.MONGODB_PASSWORD;
/**
 * Replica nodes to connect with
 */
const REPLICA_NODES = [
  `udomocluster-shard-00-00-isumt.mongodb.net:${ process.env.MONGODB_PORT }`,
  `udomocluster-shard-00-01-isumt.mongodb.net:${ process.env.MONGODB_PORT }`,
  `udomocluster-shard-00-02-isumt.mongodb.net:${ process.env.MONGODB_PORT }`,
];
const REPLICA_SET = 'uDomoCluster-shard-0';

module.exports = {
  mongo: {
    url: `
    mongodb://${ USER }:${ PASSWORD }@${ REPLICA_NODES.join(',') }
    /uDomo?ssl=true&replicaSet=${ REPLICA_SET }&authSource=admin
    `.replace(/[\n ]/g, ''),
  },
};
