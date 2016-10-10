var Configs = require("../models/routes");

module.exports = (app, log) => {
    var Configurations = {
        GetConfigurations: (callback) => {
			Configs.find({}, (e, c) => {
				e ? callback(e, null) : callback(null, c);
			});
        }
    };
    
    app
    .get('/api/Configurations', (request, response) => {
        Configurations.GetConfigurations((error, configs) => {
            response.json({Configurations : configs, Error : error});
        });
    })
   
    process.on('uncaughtException', (e) => {
        log.error(e.stack);
    });
};