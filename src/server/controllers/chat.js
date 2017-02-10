'use strict';

import Flight from '../models/flight';
import contentResponse from '../helpers/APIResponse';
import SendBird from 'sendbird-nodejs';

const API_TOKEN = process.env.GM_SENDBIRD_API_TOKEN;
const CREATE_ERROR = 405;
const CREATE_SUCCESS = 200;

function createFlightChannel(req, res) {
  const flightName = req.params.flightname.toUpperCase();
  const getFlight = Flight.getFlightFromFlightName(flightName);
  const sb = getSendBirdInstance();

  getFlight
    .then(getUsersForFlight)
    .then((userIds) => {
      const options = {
        name: flightName,
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
      res.sendStatus(CREATE_ERROR);
    });
}

function getSendBirdInstance() {
  return new SendBird(API_TOKEN);
}

function getUsersForFlight(foundFlight) {
  if (foundFlight) {
    const userIds = foundFlight.userIds || [];
    return Promise.resolve(userIds);
  }
  return Promise.reject();
}

export default {
  createFlightChannel
};
