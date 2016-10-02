import Flight from '../models/flight';

function list(req, res) {
  const {
    limit = 50, skip = 0
  } = req.query;

  Flight.list({
    limit, skip
  }).then((flights) => {
    res.json({
      content: flights
    });
  }, (error) => {
    res.json(error);
  });
}
export default { list };
