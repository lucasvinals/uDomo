var _ = require('lodash');

function updateOneDevice(dev){
    _.merge(process.devices[_.findIndex(process.devices, {"_id": dev._id})], dev);
};

function mergeDev(device){
    process.devices.some((d) => d._id == device._id) ? updateOneDevice(device) : process.devices.push(device);
    return process.devices;
};

function delDevice(id){
    process.devices[_.findIndex(process.devices, {"_id": id})].Saved = false;
}

module.exports = {
    mergeDevice: mergeDev,
    deletedDevice : delDevice
};