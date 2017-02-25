'use strict';

import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';

const FLIGHT_ERROR = 400;
const FLIGHT_SUCCESS = 200;
const DUPLICATE_USER_ERROR = 409;

function getFlightInfo(req, res) {
  const flightName = req.params.flightname.toUpperCase();
  const getFlight = getFlightFromFlightName(flightName);
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
      sendFailureStatus(res, err);
    } else {
      sendSuccessStatus(res);
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
  const flightName = req.params.flightname.toUpperCase();
  const userId = req.params.userid;
  const getFlight = getFlightFromFlightName(flightName);
  getFlight.then((foundFlight) => {
    if (!foundFlight) {
      return sendFailureStatus(res);
    }
    foundFlight = addMissingUserIdsProperty(foundFlight);
    if (hasDuplicateUserId(foundFlight, userId)) {
      return sendDuplicateFoundStatus(res, userId);
    }
    foundFlight = addUserIdToFlightInfo(foundFlight, userId);
    foundFlight.save();
    return sendSuccessStatus(res);
  }, (err) => sendFailureStatus(res, err));
}

function getFlightFromFlightName(flightName) {
  return Flight.getFlightFromFlightName(flightName);
}

function addUserIdToFlightInfo(flight, userId) {
  flight.userIds.push(userId);
  return flight;
}

function addMissingUserIdsProperty(flight) {
  if (!flight) {
    return flight;
  }
  const isFlightMissingUserIds = !flight.userIds;
  if (isFlightMissingUserIds) {
    flight.userIds = [];
  }
  return flight;
}

function hasDuplicateUserId(flight, userId) {
  return flight.userIds.indexOf(userId) > -1;
}

function sendSuccessStatus(res) {
  res.sendStatus(FLIGHT_SUCCESS);
}

function sendFailureStatus(res, err) {
  console.log(err);
  res.sendStatus(FLIGHT_ERROR);
}

function sendDuplicateFoundStatus(res, userId) {
  res.send(DUPLICATE_USER_ERROR,
    contentResponse({ duplicateUserId: userId }));
}

export default {
  getFlightInfo,
  postFlightInfo,
  putUserInFlight
};
