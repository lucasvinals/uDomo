let db = require('mongoose');

module.exports = db.model("Permission", new db.Schema({
                                                        _id             : String,
                                                        Name            : String,
                                                        Configuration   : require('./configurations').schema
											          }));