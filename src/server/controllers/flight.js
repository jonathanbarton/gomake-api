import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';

function getFlightInfo(req, res) {
  const flightName = req.params.flightname;
  const getFlight = Flight.getFlightFromFlightName(flightName);
  getFlight.then((flight) => {
    res.json(contentResponse(flight));
  }, (error) => {
    res.json(error);
  });
}

export default {
  getFlightInfo
};
