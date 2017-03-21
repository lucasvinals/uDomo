const Device = require('../../server/api/device/device.model');
const { Promise } = require('es6-promise');
const { times, random } = require('lodash');
const uuid = require('uuid/v4');

function CreateDevice(zone) {
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
  times(config.nmbDevices, () => {
    saveDevices.push(
      {
        _id: uuid(),
        Name: `Device_${ random(config.minRandom++, config.maxRandom) }`,
        IP: `192.168.1.${ random(config.minRandom, config.ipRandom) }`,
        Number: random(config.minRandom++, config.maxRandom),
        Saved: random(config.minRandom, config.maxRandom) > config.compareRandom,
        Online: random(config.minRandom, config.maxRandom) > config.compareRandom,
        Zone: zone,
        lastMessage: new Date(),
        Temperature: random(config.minTemperatureRandom, config.maxTemperatureRandom),
        Pressure: random(config.minPressureRandom, config.maxPressureRandom),
        Altitude: random(config.minRandom, config.maxAltitudeRandom),
        Humidity: random(config.minRandom, config.maxRandom),
        Light: random(config.minRandom, config.maxLightRandom),
        Mode: random(config.minRandom, config.maxRandom) > config.compareRandom ? 'actuator' : 'sensor',
      }
    );
  });

  return Promise.all(saveDevices.map((dummyDevice) => Device.create(dummyDevice)));
}

module.exports = CreateDevice;
