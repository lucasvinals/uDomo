let Device  = require("../models/devices");
let Common  = require('../common');
var log     = log || process.log;

var Devices = {
    /**
     * Find devices
     */
    FindDevices: (callback) => {
        Device.find({}, (error, devices) => {
            error ?
                callback('No se pueden recuperar los dispositivos -> ' + error, null) :              
                callback(null, devices);
        });
    },
    /**
     * Create a device
     */
    CreateDevice: (device, callback) => {
        Device.findOne({_id: device._id}, (e, d) => {
            /**
             * Error while saving the device. Log it and return the error
             */
            let errorSaving = (er) => {
                log.error('> Something happened saving the device. ' + er);
                callback('Algo paso guardando el dispositivo ' + device.Name, null);
            };
            /**
             * Error while searching for the device. Log it and return the error
             */
            let errorSearching = () => {
                log.error('> Something happened searching the device. ' + e);
                callback('Algo paso buscando el dispositivo \"' + 
                            device.Name + '\"', null);
            };
            /**
             * The device already exists in the database. Log and return a message
             */
            let deviceAlreadySaved = () => {
                log.warning('> The device(\"' + device._id + '\") ' +
                                    'already exists in the database!');
                callback('El dispositivo que se intenta guardar ' + 
                            'ya existe en la base de datos.', null);
            };
            /**
             * Returns the saved device
             */
            let savedDevice = (dev) => {
                log.success('> The device \"' + dev.Name + '\" was saved.');
                callback(null, dev);
            };
            /** 
             * Populate the model with the given device (request.body) and save it
             */
            let saveDevice = () => {
                new Device(device).save((error, dSaved) => {
                    error ? errorSaving(error) : savedDevice(dSaved);
                });    
            };

            e ? errorSearching() : (d ? deviceAlreadySaved() : saveDevice());
        });
    },
    /**
     * Modify Device
     */
    ModifyDevice: (device, callback) => {
        Device.update(
            {
                _id: device._id
            },
            device,
            (e, m) => {
                let error = () => {
                    log.error('> Something happened modifying the device: \"' +
                                device.Name + '\"\n\n' + e);
                    callback(e, null);
                };
                
                let deviceModified = () => {
                    log.success('> The device: \"' + m.Name + '\" was modified.');
                    callback(null, m);
                };

                e ? error() : deviceModified();
            });
    },
    /**
     * Delete a device
     */
    DeleteDevice : (id, callback) => {
        Device.findOne({_id: id}).remove((e, r) => {
            let deviceDeleted = () => {
                log.success('> The device(\"' + id + '\" was removed.');
                callback(null, r);
            };

            let error =() => {
                log.error('> Something happened removing the device \"' + id + '\"\n\n' + e);
                callback(e, null);
            };

            e ? error() : deviceDeleted();
        });
    }
};

module.exports = (app) => {    
    app
    /**
     * Get devices
     */
    .get('/api/Devices', (request, response) => {
        Devices.FindDevices((error, devices) => {
            devices.forEach((d) => Common.mergeDevices(d));
            response.json({Devices: process.devices, Error: error});
        });
    })
    /**
     * Create a device
     */
    .post('/Device', (request, response) => {
        Devices.CreateDevice(request.body, (error, device) => {
            response.json({Device : device, Error : error});
        });
    })
    /**
     * Modify a device
     */
    .put('/Device', (request, response) => {
        Devices.ModifyDevice(request.body, (error, device) => {
            response.json({Device : device, Error : error});
        });
    })
    /**
     * Delete a device
     */
    .delete('/Device/:id', (request, response) => {
        Devices.DeleteDevice(request.params.id, (error, device) => {
            response.json({Device : device, Error: error});
        });
    });
};