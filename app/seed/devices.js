const Devices = require('../models/devices');
const Promise = require('es6-promise').Promise;
const _ = require('lodash');

function CreateDevice(area) {
  const saveDevices = [];

  const config = {
    nmbDevices: 10,
    maxRandom: 100,
    minRandom: 0,
    compareRandom: 50,
    ipRandom: 255,
    minPressureRandom: 980,
    maxPressureRandom: 1080,
    minTemperatureRandom: 10,
    maxTemperatureRandom: 40,
    maxAltitudeRandom: 50,
    maxLightRandom: 16000,
  };
  _.times(config.nmbDevices, () => {
    saveDevices.push(
      new Devices(
        {
          Name: `Device_${ _.random(config.minRandom++, config.maxRandom) }`,
          IP: `192.168.1.${ _.random(config.minRandom, config.ipRandom) }`,
          Number: _.random(config.minRandom++, config.maxRandom),
          Saved: _.random(config.minRandom, config.maxRandom) > config.compareRandom,
          Online: _.random(config.minRandom, config.maxRandom) > config.compareRandom,
          Area: area,
          lastMessage: new Date(),
          Temperature: _.random(config.minTemperatureRandom, config.maxTemperatureRandom),
          Pressure: _.random(config.minPressureRandom, config.maxPressureRandom),
          Altitude: _.random(config.minRandom, config.maxAltitudeRandom),
          Humidity: _.random(config.minRandom, config.maxRandom),
          Light: _.random(config.minRandom, config.maxLightRandom),
          Mode: _.random(config.minRandom, config.maxRandom) > config.compareRandom ? 'actuator' : 'sensor',
        }
      )
    );
  });

  return Promise.all(_.map(saveDevices, (dummyDevice) => dummyDevice.save()));
}

module.exports = {
  CreateDevice,
};
