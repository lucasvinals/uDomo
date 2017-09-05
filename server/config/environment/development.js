const USER = process.env.MONGODB_USER;
const PASSWORD = process.env.MONGODB_PASSWORD;
const REPLICA_NODES = [
  'udomocluster-shard-00-00-isumt.mongodb.net:27017',
  'udomocluster-shard-00-01-isumt.mongodb.net:27017',
  'udomocluster-shard-00-02-isumt.mongodb.net:27017'
];
const REPLICA_SET = 'uDomoCluster-shard-0';

module.exports = {
  mongo: {
    url: `mongodb://${USER}:${PASSWORD}@${REPLICA_NODES.join(',')}/uDomo?ssl=true&replicaSet=${REPLICA_SET}&authSource=admin`,
  },
};
