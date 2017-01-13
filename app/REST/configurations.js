const ConfigurationsSchema = require("../models/configurations");
var log = log || process.log;

const Configurations = {
    FindConfigurations: (callback) => {
        ConfigurationsSchema.find({}, (e, c) => {
            e?
                (!log.error(e) && callback(e, null)):
                callback(null, c);
        });
    },
    CreateConfigurations: (config, callback) => {
       
        ConfigurationsSchema.findOne({Name: config.Name}, (e, c) => {
            /**
             * Error while saving the configuration. Log it and return the error
             */
            let errorSaving = (er) => {
                log.error('> Something happened saving the configuration. ' + er);
                callback('Algo paso guardando la configuración ' + config.Name, null);
            };
            /**
             * Error while searching for the configuration. Log it and return the error
             */
            let errorSearching = () => {
                log.error('> Something happened searching the configuration. ' + e);
                callback('Algo paso buscando la configuracion \"' + 
                            config.Name + '\"', null);
            };
            /**
             * The configuration already exists in the database. Log and return a message
             */
            let configurationAlreadySaved = () => {
                log.warning('> The configuration(\"' + config.Name + '\") ' +
                                    'already exists in the database!');
                callback('La configuración que se intenta guardar ' + 
                            'ya existe en la base de datos.', null);
            };
            /**
             * Returns the saved device
             */
            let savedConfiguration = (con) => {
                log.success('> The configuration \"' + con.Name + '\" was saved.');
                callback(null, con);
            };
            /** 
             * Populate the model with the given device (request.body) and save it
             */
            let saveConfiguration = () => {
                new ConfigurationsSchema(config).save((error, cSaved) => {
                    error ? errorSaving(error) : savedConfiguration(cSaved);
                });    
            };

            e ? errorSearching() : (c ? configurationAlreadySaved() : saveConfiguration());
        });
    }
};

module.exports = (app) => {
    app
    .get('/api/Configurations', (request, response) => {
        Configurations.FindConfigurations((error, configs) => {
            response.json({"Configurations": configs, "Error": error});
        });
    })
    .post('/Configuration', (request, response) => {
        Configurations.CreateConfigurations(request.body, (e, c) => {
            response.json({"Configuration": c, "Error": e});
        });
    });
};