function updateOneDevice(dev){
    process.devices = process.devices.filter((d) => d._id !== dev._id);
    process.devices.push(dev);
};

function mergeDev(device){
    process.devices.some((d) => d._id == device._id) ? updateOneDevice(device) : process.devices.push(device);
    return process.devices;
};

module.exports = {
    mergeDevice: mergeDev
};