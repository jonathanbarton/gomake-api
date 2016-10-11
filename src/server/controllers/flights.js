import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';

function list(req, res) {
  const {
    limit = 50, skip = 0
  } = req.query;

  Flight.list({
    limit, skip
  }).then((flights) => {
    res.json(contentResponse(flights));
  }, (error) => {
    res.json(error);
  });
}
export default { list };
