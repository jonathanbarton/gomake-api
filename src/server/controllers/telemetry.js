import Telemetry from '../models/telemetry';
import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';

const NodeCache = require('node-cache');
const telemetryCache = new NodeCache({ stdTTL: 120, checkperiod: 125 });
const TELEMETRY_ERROR = 400;

function getTelemetry(req, res) {
  const flightName = req.params.flightname;
  checkTelemetryCache(flightName, res);
}

function getTelemetryForAssignedDevices(foundFlight) {
  const devices = foundFlight.deviceIds;
  return Telemetry.findOne({ deviceId: { $in: devices } });
}

function checkTelemetryCache(flightName, res) {
  const onCheckTelemetryCache = handleCheckTelemetryCache(flightName, res);
  telemetryCache.get(flightName, onCheckTelemetryCache);
}

function handleCheckTelemetryCache(flightName, res) {
  return (err, cachedTelemetry) => {
    const sendCachedResponse = sendSuccessResponse(res);
    const isUncached = (cachedTelemetry === undefined);
    if (err) {
      sendFailureResponse(res);
    } else if (isUncached) {
      getUncachedTelemetry(flightName, res);
    } else {
      sendCachedResponse(cachedTelemetry);
    }
  };
}

function sendFailureResponse(res) {
  return () => { res.sendStatus(TELEMETRY_ERROR); };
}

function sendSuccessResponse(res) {
  return (telemetry) => { res.json(contentResponse(telemetry)); };
}

function getUncachedTelemetry(flightName, res) {
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

export default { getTelemetry };
