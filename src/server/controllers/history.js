import Flight from '../models/flight';
import Telemetry from '../models/telemetry';
import contentResponse from '../helpers/APIResponse';

const TELEMETRY_ERROR = 400;

function getFlightHistory(req, res) {
  const flightName = req.params.flightname;
  const getFlight = Flight.getFlightFromFlightName(flightName);
  getFlight
    .then(getHistoryForAssignedDevices, sendFailureResponse(res))
    .then(sendSuccessResponse(res), sendFailureResponse(res));
}

function getHistoryForAssignedDevices(foundFlight) {
  const devices = foundFlight.deviceIds;
  return Telemetry.find({ deviceId: { $in: devices } })
    .sort('-transmitTime');
}

function sendFailureResponse(res) {
  return (telemetry) => { res.json(contentResponse(telemetry)); };
}

function sendSuccessResponse(res) {
  return () => { res.sendStatus(TELEMETRY_ERROR); };
}

export default {
  getFlightHistory
};
