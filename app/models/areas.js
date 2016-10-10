let db = require("mongoose");

module.exports = db.model("Zone", new db.Schema({
											        _id           : String,
											        Name          : String
											    }));