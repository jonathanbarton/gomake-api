'use strict';

import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';
import SendBird from 'sendbird-nodejs';

const API_TOKEN = process.env.GM_SENDBIRD_API_TOKEN;
const CREATE_ERROR = 405;
const CREATE_USERS_NOT_FOUND = 404;
const CREATE_SUCCESS = 200;

function createFlightChannel(req, res) {
  const flightName = req.params.flightname.toUpperCase();
  const getFlight = getFlightFromFlightName(flightName);
  const sb = getSendBirdInstance();

  getFlight
    .then(getUsersForFlight)
    .then((userIds) => {
      const options = {
        name: flightName,
        custom_type: flightName,
        user_ids: userIds,
        is_distinct: true
      };
      return sb.groupChannels.create(options);
    })
    .then((response) => {
      if (response) {
        const channelUrl = response.channel_url;
        res.send(CREATE_SUCCESS, contentResponse({ channel_url: channelUrl }));
      } else {
        res.sendStatus(CREATE_ERROR);
      }
    }, (err) => {
      console.log(err);
      res.sendStatus(err);
    });
}

function getFlightFromFlightName(flightName) {
  return Flight.getFlightFromFlightName(flightName);
}

function getSendBirdInstance() {
  return new SendBird(API_TOKEN);
}

function getUsersForFlight(foundFlight) {
  if (foundFlight) {
    const userIds = foundFlight.userIds || [];
    if (!!!userIds.length) {
      return Promise.reject(CREATE_USERS_NOT_FOUND);
    }
    return Promise.resolve(userIds);
  }
  return Promise.reject(CREATE_ERROR);
}

function getFlightChannel(req, res) {
  const flightName = req.params.flightname.toUpperCase();
  getChannelForFlight(flightName)
    .then((response) => {
      const channels = response.channels;
      res.json(contentResponse(channels));
  });
}

function getChannelForFlight(flightName) {
  const sb = getSendBirdInstance();
  const options = {
    custom_type: flightName
  };
  return sb.groupChannels.list(options);
}

export default {
  createFlightChannel,
  getFlightChannel
};
