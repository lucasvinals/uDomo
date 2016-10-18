let db = require("mongoose");
let permissions = require('./permissions').schema;

module.exports = db.model("User", new db.Schema({
                                                    _id           : String,
                                                    Token         : String,
                                                    Name          : String,
                                                    Age           : Number,
                                                    Username      : String,
                                                    Email         : String,
                                                    Password      : String,
                                                    Permissions   : permissions
                                                }));