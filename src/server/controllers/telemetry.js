import Telemetry from '../models/telemetry';
import contentResponse from '../helpers/APIResponse';

function getTelemetry(req, res) {
  const flightNameArray = req.params.flightname.split('-');
  const callSign = flightNameArray[0];
  const flightNumber = flightNameArray[1];
  return Telemetry.findOne({ callSign, flightNumber })
  .then((err, telemetry) => {
    if (err) {
      res.sendStatus(400);
    }
    res.json(contentResponse(telemetry));
  });
}

export default { getTelemetry };
