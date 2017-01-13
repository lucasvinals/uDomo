var Area    = require('../models/areas');
let Devices = require('../models/devices');
var log     = log || process.log;

var Areas = {
    /**
     * Find Areas
     */
    FindAreas: (callback) => {
        Area.find({}, (e, a) => {
            e ?
                callback(e, null) : 
                callback(null, a); 
        });
    },
    /**
     * Create Area
     */
    CreateArea: (area, callback) => {
        Area.findOne({Name: area.Name}, (e, a) => {
            /**
             * Error while saving the area in the database
             */
            let errorSaving = (er) => {
                log.error('> Something happened creating the area. ' + er);
                callback('Algo paso creando el area \"' + area.Name + '\"', null);
            };
            /**
             * Error while searching for an area in the database
             */
            let errorSearching = () => {
                log.error('> Something happened searching the area in ' +
                            'the database. -> ' + e);
                callback('Algo paso creando el area \"' + area.Name + '\"', null);
            };
            /**
             * The area given is already in the database 
             */
            let areaAlreadySaved = () => {
                log.warning('> The area with name \"' + a.Name + '\" already exists!');
                callback('El area ingresada ya existe. Elija otro nombre.', null);
            };
            /**
             * The area was successfully saved in the database
             */
            let savedArea = (a) => {
                log.success('> The area \"' + a.Name + '\" was created.');
                callback(null, a);
            };
            /**
             * Save the area in the database with the given area object
             */
            let createArea = () => {
                new Area(area).save((error, aSaved) => {
                    error ? errorSaving(error) : savedArea(aSaved);
                });
            };

            e ? errorSearching() : (a ? areaAlreadySaved() : createArea());
        }); 
    },
    /**
     * Modify an Area
     */
    ModifyArea: (area, callback) => {
        Area.update(
            {
                _id: area.id
            },
            area,
            (e, a) => {
            
                let error = () => {
                    log.error('> Something happened updating the area: \"' + 
                                a.Name + '\"\n\n' + e);
                    callback(e, null);
                };
                let modifiedArea = () => {
                    log.success('> The area: \"' + a.Name + '\" was modified.');
                    callback(null, a);
                };

                e ? error() : modifiedArea();
        });
    },
    /**
     * Delete an Area
     */
    DeleteArea: (id, callback) => {
        let area = Area.findOne({_id: id});
        Devices.find({"Area": area}, (e, devs) => {
            devs.forEach((d) => {
                Devices.remove({_id: d._id});
            });
        });
        area.remove((e, r) => {
            let error = () => {
                log.error('> Something happened removing the area with GUID: \"' +
                            id + '\"\n\n' + e);
                callback(e, null);
            };
            let deletedArea = () => {
                log.success('> The area (\"' + id + '\") was removed.' );
                callback(null, r);
            };

            e ? error() : deletedArea();
        });
    }
};

module.exports = (app) => {
    app
    /**
     * Get Areas
     */
    .get('/api/Areas', (request, response) => {
        Areas.FindAreas((error, areas) => {
            response.json({Areas: areas, Error: error});
        });
    })
    /**
     * Create an Area
     */
    .post('/Area', (request, response) => {
        Areas.CreateArea(request.body, (error, area) => {
            response.json({Area: area, Error: error});
        });
    })
    /**
     * Modify an Area
     */
    .put('/Area', (request, response) => {
        Areas.ModifyArea(request.body, (error, area) => {
			response.json({Area : area, Error : error});
		});
    })
    /**
     * Delete Area
     */
    .delete('/Area/:id', (request, response) => {
        Areas.DeleteArea(request.params.id, (error, area) => {
            response.json({Removed: area, Error: error});
        });
    });
};