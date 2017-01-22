'use strict';

module.exports = {
  _pre: 'convertDataToObject',
  deviceId: { field: 'device_id' },
  transmitTime: { field: 'transmit_time', transform: 'getTransmitTime' },
  location: { field: 'data', transform: 'getLocation' },
  altitude: { field: 'data', transform: 'getAltitude' },
  satellites: { field: 'data', transform: 'getSatellites' },
  fixQuality: { field: 'data', transform: 'getFixQuality' },
  sensors: { field: 'data', transform: 'getSensorData' }
};
