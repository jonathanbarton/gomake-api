import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';

const FLIGHT_ERROR = 400;
const FLIGHT_SUCCESS = 200;

function getFlightInfo(req, res) {
  const flightName = req.params.flightname;
  const getFlight = Flight.getFlightFromFlightName(flightName);
  getFlight.then((flight) => {
    res.json(contentResponse(flight));
  }, (error) => {
    res.json(error);
  });
}

function postFlightInfo(req, res) {
  const flightName = req.params.flightname;
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

export default {
  getFlightInfo,
  postFlightInfo
};
