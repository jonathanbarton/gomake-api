'use strict';

const AUTHENTICATION_FAILURE_STATUS = 401;
const AUTHENTICATION_FAILURE_MESSAGE = 'Unauthorised';
const request = require('request');

function authentication(req, res, done) {
  const header = req.headers['authorization'];
  if (!header) {
    return sendAuthenticationFailure(res);
  }
  auth0Verify(req, res, header, done);
}


function auth0Verify(req, res, header, done) {
  var options = {
    method: 'GET',
    url: 'https://gomake.auth0.com/api/v2/users',
    headers: {
      authorization: `${header}`
    }
  };

  request(options, (error, response, body) => {
    const pasrsedBody = JSON.parse(body);
    const hasError = error || (pasrsedBody.error);

    if (hasError) {
      sendAuthenticationFailure(res);
    } else {
      req.user = pasrsedBody;
      done();
    }
  });
}

function sendAuthenticationFailure(res) {
  res.status(AUTHENTICATION_FAILURE_STATUS);
  res.json({ message: AUTHENTICATION_FAILURE_MESSAGE });
}

module.exports = authentication;
