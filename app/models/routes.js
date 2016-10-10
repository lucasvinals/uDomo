var db = require("mongoose");

module.exports = db.model("Route", new db.Schema({
											        _id         : String,
											        relPath     : String,
											        filePath	: String,
											        controller 	: String
											    }));