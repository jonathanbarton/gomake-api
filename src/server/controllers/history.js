import Flight from '../models/flight';
import Telemetry from '../models/telemetry';
import contentResponse from '../helpers/APIResponse';

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
    const startTimeAsDate = new Date(startTransmitTime);
    return Telemetry.find({ deviceId: { $in: devices }, transmitTime: { $gte: startTimeAsDate } })
      .sort('-transmitTime');
  };
}

function sendFailureResponse(res) {
  return () => { res.sendStatus(TELEMETRY_ERROR); };
}

function sendSuccessResponse(res) {
  return (telemetry) => { res.json(contentResponse(telemetry)); };
}

export default {
  getFlightHistory
};
