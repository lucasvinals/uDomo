var Configs = require("../models/routes");
var log     = log || process.log;

var Configurations = {
    GetConfigurations: (callback) => {
        Configs.find({}, (e, c) => {
            e ? callback(e, null) : callback(null, c);
        });
    }
};

module.exports = (app) => {
    app
    .get('/api/Configurations', (request, response) => {
        Configurations.GetConfigurations((error, configs) => {
            response.json({Configurations : configs, Error : error});
        });
    });
};