'use strict';

module.exports = {
  convertDataToObject,
  getLatitude,
  getLongitude,
  getAltitude,
  getSatellites,
  getFixQuality,
  getSensorData
};

function convertDataToObject(body) {
  const decodedData = hexToAscii(body.data);
  const dataObject = queryStringToObject(decodedData);
  body.data = dataObject;
  return body;
}

function queryStringToObject(decodedData) {
  return decodedData
    .split('&')
    .map((pair) => pair.split('='))
    .filter((pair) => pair.length === 2)
    .reduce((acc, pair) => {
      acc[pair[0]] = pair[1];
      return acc;
    }, {});
}

function hexToAscii(hexData) {
  const hex = hexData.toString(); // force conversion
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

function getLatitude(field) {
  return field.latitude;
}

function getLongitude(field) {
  return field.longitude;
}

function getAltitude(field) {
  return field.altitude;
}

function getSatellites(field) {
  return field.satellites;
}

function getFixQuality(field) {
  return field.fix_quality;
}

function getSensorData(field) {
  const sensors = {};
  sensors.sound = field.Sound;
  sensors.barometer = field.Barometer;
  sensors.temperature = field.Temperature;
  return sensors;
}
