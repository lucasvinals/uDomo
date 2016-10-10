const db      = require("mongoose");
let Areas   = require('./areas');

module.exports = db.model("Device", new db.Schema({
                                                    _id         : String, //GUID from ESP8266
                                                    Name        : String, // Human readable name
                                                    IP          : String, // IP
                                                    N           : Number, // Number
                                                   // Z           : String, // Zone-Area
                                                    //idZ         : String, // Zone-Area
                                                    Saved       : Boolean, // Saved?
                                                    Online      : Boolean, // Online?
                                                    Area        : Areas.schema,                                     
                                                    lastMessage : Date // Last message received
                                                    
                                                    //Temperature   : Number,
                                                    //Pressure      : Number,
                                                    //Altitude      : Number,
                                                    // Humidity      : Number,
                                                    // Light         : Number
                                                }));