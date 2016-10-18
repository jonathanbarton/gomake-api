import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';

function getFlightInfo(req, res) {
  const flightNameArray = req.params.flightname.split('-');
  const callSign = flightNameArray[0];
  const flightNumber = parseInt(flightNameArray[1], 10);

  return Flight.findOne({ callSign, flightNumber })
    .then((flight) => {
      res.json(contentResponse(flight));
    },
    (error) => {
      res.json(error);
    });
}

export default { getFlightInfo };
