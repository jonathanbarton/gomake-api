import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';
import winston from '../../config/winston';

const NO_FLIGHTS_ERROR = 'No flights found for user';
const NO_USERS_ERROR = 'No user_id found';
const ERROR_STATUS = 404;

function getFlights(req, res) {
  const user = req.user;
  const userId = getUserId(user);
  return Flight
    .list(userId)
    .then((flights) => {
      if (!userId) {
        throw new Error(NO_USERS_ERROR);
      }
      if (!flights) {
        throw new Error(NO_FLIGHTS_ERROR);
      }
      return res.json(contentResponse(flights));
    })
    .catch((err) => {
      winston.log('error', err.message);
      res.status(ERROR_STATUS);
      res.send(err.message);
    });
}

function getUserId(user) {
  try {
    return user.user_id.split('|')[1];
  } catch (e) {
    return false;
  }
}

export default { getFlights };
