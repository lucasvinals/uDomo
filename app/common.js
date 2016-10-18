function updateOneDevice(dev){
    process.env.devices = process.env.devices.filter((d) => d._id !== dev._id);
    process.env.devices.push(dev);
};

function mergeDev(device){
    process.env.devices.some((d) => d._id == device._id) ? updateOneDevice(device) : process.env.devices.push(device);
    return process.env.devices;
};

module.exports = {
    mergeDevice: mergeDev
};