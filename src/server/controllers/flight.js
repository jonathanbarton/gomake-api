import Flight from '../models/flight';
import mongoErrorCodes from '../models/mongoErrorCodes';

const NO_VALID_USERID_ERROR = 'No valid user Id present';
const NO_VALID_FLIGHT_ERROR = 'No valid flight present';
const MISSING_REQUIRED_PARAMS = 'Missing required parameters';
const DUPLICATE_VALUE = 'Duplicate value';

function getFlightInfo(req, res) {
  const flightName = req.params.flightname.toUpperCase();
  const getFlight = Flight.getFlightFromFlightName(flightName);
  getFlight.then((flight) => {
    res.ok(res, flight);
  }, (err) => {
    res.serverError(res, err);
  });
}

function postFlightInfo(req, res) {
  const flightName = req.params.flightname.toUpperCase();
  const flightInfo = parseFlightInfo(flightName, req.body);

  if (!flightInfo) {
    return res.badRequest(res, MISSING_REQUIRED_PARAMS);
  }

  const newFlight = new Flight(flightInfo);
  newFlight.save((err) => {
    if (err) {
      console.log(err.code === mongoErrorCodes.DUPLICATE);
      if (err.code === mongoErrorCodes.DUPLICATE) {
        res.duplicateError(res, DUPLICATE_VALUE);
      } else {
        res.serverError(res, err);
      }
    } else {
      res.ok(res);
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
  if (!userId) {
    return res.badRequest(res, NO_VALID_USERID_ERROR);
  }
  const dbUpdateConfig = {
    $addToSet: {
      userIds: userId
    }
  };
  return updateFlightUsers(req, res, dbUpdateConfig);
}

function deleteUserInFlight(req, res) {
  const userId = getUserId(req.user, res);
  if (!userId) {
    return res.badRequest(res, NO_VALID_USERID_ERROR);
  }
  const dbUpdateConfig = {
    $pull: {
      userIds: userId
    }
  };
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
        res.badRequest(res, NO_VALID_FLIGHT_ERROR);
        return false;
      }
      res.ok(res);
      return foundFlight;
    })
    .catch((err) => {
      res.badRequest(res, err);
      return err;
    });
}

function getUserId(user) {
  const userId = user.user_id;
  return userId;
}

export default {
  getFlightInfo,
  postFlightInfo,
  putUserInFlight,
  deleteUserInFlight
};
