const mongoose = require('mongoose');
const { mongo } = require('../../../config/environment');
/**
 * Prevents the mongo mpromise deprecation message
 */
mongoose.Promise = require('bluebird');
/**
 * Connect to MongoDB engine
 */
function connect() {
  /**
   * 0 = disconnected,
   * 1 = connected,
   * 2 = connecting,
   * 3 = disconnecting
   */
  if (mongoose.connection.readyState === 0) {
    return mongoose.connect(
      mongo.url,
      {
        useMongoClient: true,
        keepAlive: true,
        reconnectTries: Number.MAX_VALUE,
      }
    );
  }
  return mongoose.connection;
}

module.exports = connect;
