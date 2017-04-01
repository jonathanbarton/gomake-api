import Flight from '../models/flight';
import Telemetry from '../models/telemetry';
import contentResponse from '../helpers/APIResponse';
import logger from '../utils/logger';

const TELEMETRY_ERROR = 400;

function getFlightHistory(req, res) {
  const flightName = req.params.flightname.toUpperCase();
  const getFlight = Flight.getFlightFromFlightName(flightName);
  const startTransmitTime = req.query.start;
  getFlight
    .then(getHistoryForAssignedDevices(startTransmitTime), sendFailureResponse(res))
    .then(sendSuccessResponse(res), sendFailureResponse(res));
}

function getHistoryForAssignedDevices(startTransmitTime) {
  return (foundFlight) => {
    const devices = foundFlight.deviceIds;
    const startTimeAsDate = getStartTimeAsDate(startTransmitTime);
    return Telemetry.find({
      deviceId: { $in: devices },
      transmitTime: { $gte: startTimeAsDate }
    }).sort('-transmitTime');
  };
}

function getStartTimeAsDate(startTransmitTime) {
  const startTimeAsDate = (!!Date.parse(startTransmitTime)) ?
    new Date(Date.parse(startTransmitTime)) : new Date(0);
  const timeZoneOffset = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = (new Date(startTimeAsDate - timeZoneOffset)).toISOString().slice(0, -1);
  return localISOTime;
}

function sendFailureResponse(res) {
  return (err) => {
    logger.logFailure(err);
    res.sendStatus(TELEMETRY_ERROR);
  };
}

function sendSuccessResponse(res) {
  return (telemetry) => { res.json(contentResponse(telemetry)); };
}

export default {
  getFlightHistory
};
