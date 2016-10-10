let db = require("mongoose");

module.exports = db.model("User", new db.Schema({
                                                    _id           : String,
                                                    Token         : String,
                                                    Name          : String,
                                                    Age           : Number,
                                                    Username      : String,
                                                    Email         : String,
                                                    Password      : String,
                                                    Permissions   : require('./permissions').schema
                                                }));