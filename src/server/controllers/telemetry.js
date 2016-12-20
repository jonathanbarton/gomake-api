import Telemetry from '../models/telemetry';
import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';
var RockBlockParser = require('../services/parsers/rockblock');

const TELEMETRY_ERROR = 400;
const TELEMETRY_SUCCESS = 200;
const TELEMETRY_CACHE_TTL = 120;
const TELEMETRY_CACHE_CHECK = 125;
const TELEMETRY_CACHE_OPTIONS = {
  stdTTL: TELEMETRY_CACHE_TTL,
  checkperiod: TELEMETRY_CACHE_CHECK
};

const NodeCache = require('node-cache');
const telemetryCache = new NodeCache(TELEMETRY_CACHE_OPTIONS);

function getTelemetry(req, res) {
  const flightName = req.params.flightname;
  return checkTelemetryCache(flightName, res);
}

function getTelemetryForAssignedDevices(foundFlight) {
  const devices = foundFlight.deviceIds;
  return Telemetry.findOne({ deviceId: { $in: devices } });
}

function checkTelemetryCache(flightName, res) {
  const onCheckTelemetryCache = onCacheResponse(flightName, res);
  return telemetryCache.get(flightName, onCheckTelemetryCache);
}

function onCacheResponse(flightName, res) {
  return (err, cachedTelemetry) => {
    const sendCachedResponse = sendSuccessResponse(res);
    if (err) {
      sendFailureResponse(res);
    } else if (isUncached(cachedTelemetry)) {
      sendUncachedTelemetry(flightName, res);
    } else {
      sendCachedResponse(cachedTelemetry);
    }
  };
}

function isUncached(cacheValue) {
  return (cacheValue === undefined);
}

function sendFailureResponse(res) {
  return () => { res.sendStatus(TELEMETRY_ERROR); };
}

function sendSuccessResponse(res) {
  return (telemetry) => { res.json(contentResponse(telemetry)); };
}

function sendUncachedTelemetry(flightName, res) {
  const getFlight = Flight.getFlightFromFlightName(flightName);
  getFlight
    .then(getTelemetryForAssignedDevices, sendFailureResponse(res))
    .then(setTelemetryCache(flightName))
    .then(sendSuccessResponse(res), sendFailureResponse(res));
}

function setTelemetryCache(flightName) {
  return (telemetry) => {
    telemetryCache.set(flightName, telemetry);
    return telemetry;
  };
}

function postTelemetry(req, res) {
  const parser = new RockBlockParser();
  const telemetry = parser.getTelemetryFromBody(req.body);
  return telemetry.save((err) => {
    if (err) {
      res.sendStatus(TELEMETRY_ERROR);
    } else {
      res.sendStatus(TELEMETRY_SUCCESS);
    }
  });
}

export default { getTelemetry, postTelemetry };
