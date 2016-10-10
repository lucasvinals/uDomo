let db = require("mongoose");

module.exports = db.model("Configuration", new db.Schema({
											        _id           : String,
											        Name          : String,
                                                    createdDate   : Date,
                                                    Security      : Boolean,
                                                    Readings      : Boolean,
                                                    Scenes        : Boolean,
                                                    Devices       : Boolean,
                                                    Users         : Boolean
											    }));