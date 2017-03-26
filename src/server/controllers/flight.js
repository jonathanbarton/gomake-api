import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';
import winston from '../../config/winston';

const FLIGHT_ERROR = 400;
const FLIGHT_SUCCESS = 200;

function getFlightInfo(req, res) {
  const flightName = req.params.flightname.toUpperCase();
  const getFlight = Flight.getFlightFromFlightName(flightName);
  getFlight.then((flight) => {
    res.json(contentResponse(flight));
  }, (error) => {
    res.json(error);
  });
}

function postFlightInfo(req, res) {
  const flightName = req.params.flightname.toUpperCase();
  const flightInfo = parseFlightInfo(flightName, req.body);
  const newFlight = new Flight(flightInfo);
  newFlight.save((err) => {
    if (err) {
      res.sendStatus(FLIGHT_ERROR);
    } else {
      res.sendStatus(FLIGHT_SUCCESS);
    }
  });
}

function parseFlightInfo(flightName, body) {
  const flightNameArray = flightName.split('-');
  const callSign = flightNameArray[0];
  const flightNumber = parseInt(flightNameArray[1], 10);
  const isValidFlight = validateFlightInfo(body);
  if (!isValidFlight) {
    return false;
  }

  return {
    callSign,
    flightNumber,
    launchStartDateTime: new Date(body.launchStartDateTime),
    launchLocation: JSON.parse(body.launchLocation),
    launchAltitude: parseInt(body.launchAltitude, 10),
    registeredTrackers: JSON.parse(body.registeredTrackers),
    deviceIds: JSON.parse(body.deviceIds)
  };
}

function validateFlightInfo(body) {
  let isValidFlight = !!body.launchStartDateTime && !!Date.parse(body.launchStartDateTime);
  isValidFlight = isValidFlight && !!body.launchLocation
    && isValidGeoJson(JSON.parse(body.launchLocation));
  isValidFlight = isValidFlight && !!body.launchAltitude;
  isValidFlight = isValidFlight && !!body.registeredTrackers
    && Array.isArray(JSON.parse(body.registeredTrackers));
  isValidFlight = isValidFlight && !!body.deviceIds
    && Array.isArray(JSON.parse(body.deviceIds));
  return isValidFlight;
}

function isValidGeoJson(location) {
  return !!location.coordinates;
}

function putUserInFlight(req, res) {
  const userId = getUserId(req.user);
  const dbUpdateConfig = { $addToSet: { userIds: userId } };
  return updateFlightUsers(req, res, dbUpdateConfig);
}

function deleteUserInFlight(req, res) {
  const userId = getUserId(req.user);
  const dbUpdateConfig = { $pull: { userIds: userId } };
  return updateFlightUsers(req, res, dbUpdateConfig);
}

function updateFlightUsers(req, res, dbUpdateConfig) {
  const flightName = req.params.flightname.toUpperCase();
  const flightNameArray = Flight.getFlightNameArray(flightName);
  const callSign = flightNameArray[0];
  const flightNumber = flightNameArray[1];
  return Flight.findOneAndUpdate({ callSign, flightNumber }, dbUpdateConfig)
    .then((foundFlight) => {
      if (!foundFlight) {
        res.sendStatus(FLIGHT_ERROR);
      }
      res.sendStatus(FLIGHT_SUCCESS);
      return foundFlight;
    })
    .catch((err) => {
      winston.log('info', err);
      res.sendStatus(FLIGHT_ERROR);
      return err;
    });
}

function getUserId(user) {
  try {
    return user.user_id;
  } catch (err) {
    return false;
  }
}

export default {
  getFlightInfo,
  postFlightInfo,
  putUserInFlight,
  deleteUserInFlight
};
