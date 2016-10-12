import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';

function getFlights(req, res) {
  const limit = 50;
  const skip = 0;

  return Flight.list(limit, skip).then((flights) => {
    res.json(contentResponse(flights));
  }, (error) => {
    res.json(error);
  });
}
export default { getFlights };
