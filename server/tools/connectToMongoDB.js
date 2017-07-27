const mongoose = require('mongoose');

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
      process.MongoURL,
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
