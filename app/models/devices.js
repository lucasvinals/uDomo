const db      = require("mongoose");
let Areas   = require('./areas');

module.exports = db.model("Device", new db.Schema({
                                                    _id         : String,
                                                    Name        : String,
                                                    IP          : String,
                                                    N           : Number,
                                                    Saved       : Boolean,
                                                    Online      : Boolean,
                                                    Area        : Areas.schema,                                     
                                                    lastMessage : Date,
                                                    Temperature : Number,
                                                    Pressure    : Number,
                                                    Altitude    : Number,
                                                    Humidity    : Number,
                                                    Light       : Number
                                                }));