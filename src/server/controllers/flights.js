import Flight from '../models/flight';
const NO_USERS_ERROR = 'No user_id found in token';

function getFlights(req, res) {
  const user = req.user;
  const userId = getUserId(user);

  if (!userId) {
    return res.serverError(res, NO_USERS_ERROR);
  }
  return Flight
    .list(userId)
    .then((flights) => {
      return res.ok(res, flights);
    })
    .catch((err) => {
      return res.serverError(res, err);
    });
}

function getUserId(user) {
  const userId = user.user_id;
  return userId;
}

export default {
  getFlights
};
