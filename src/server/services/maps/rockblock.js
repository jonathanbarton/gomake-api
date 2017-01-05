'use strict';

module.exports = {
  _pre: 'convertDataToObject',
  deviceId: { field: 'device_id' },
  transmitTime: { field: 'transmit_time' },
  latitude: { field: 'data', transform: 'getLatitude' },
  longitude: { field: 'data', transform: 'getLongitude' },
  altitude: { field: 'data', transform: 'getAltitude' },
  satellites: { field: 'data', transform: 'getSatellites' },
  fixQuality: { field: 'data', transform: 'getFixQuality' },
  sensors: { field: 'data', transform: 'getSensorData' }
};
