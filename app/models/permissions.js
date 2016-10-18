let db = require('mongoose');
let configurations = require('./configurations').schema;

module.exports = db.model("Permission", new db.Schema({
                                                        _id             : String,
                                                        Name            : String,
                                                        Configuration   : configurations
											          }));