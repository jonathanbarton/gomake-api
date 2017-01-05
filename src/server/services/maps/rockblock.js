'use strict';

module.exports = {
  _pre: 'convertDataToObject',
  deviceId: { field: 'imei' },
  transmitTime: { field: 'transmit_time' },
  location: { field: 'data', transform: 'getLocation' },
  altitude: { field: 'data', transform: 'getAltitude' },
  satellites: { field: 'data', transform: 'getSatellites' },
  fixQuality: { field: 'data', transform: 'getFixQuality' },
  sensors: { field: 'data', transform: 'getSensorData' }
};
