'use strict';

var GeoJSON  = require('mongoose-geojson-schema'); //eslint-disable-line
import mongoose from 'mongoose';

module.exports = {
  convertDataToObject,
  getLocation,
  getAltitude,
  getSatellites,
  getFixQuality,
  getSensorData,
  getTransmitTime
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

function getLocation(field) {
  const long = filterFloat(field.longitude);
  const lat = filterFloat(field.latitude);
  const point = new mongoose.Schema.Types.Point();
  const coords = point.cast({
    type: 'Point',
    coordinates: [long, lat]
  });
  return coords;
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

function getTransmitTime(field) {
  const timeString = field.replace('T', ', ');
  return new Date(timeString);
}

function filterFloat(value) {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
    return Number(value);
  }
  return NaN;
}
