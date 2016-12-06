const ConfigurationsSchema = require("../models/configurations");
var log = log || process.log;

const Configurations = {
    FindConfigurations: (callback) => {
        ConfigurationsSchema.find({}, (e, c) => {
            e?
                (!log.error(e) && callback(e, null)):
                callback(null, c);
        });
    }
};

module.exports = (app) => {
    app
    .get('/api/Configurations', (request, response) => {
        Configurations.FindConfigurations((error, configs) => {
            response.json({"Configurations": configs, "Error": error});
        });
    });
};