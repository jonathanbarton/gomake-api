'use strict';

import config from '../../config/env';
const jwt = require('jsonwebtoken');
const jwtSecret = config.jwtSecret;
const jwtAudience = config.jwtAudience;
const AUTHENTICATION_FAILURE_STATUS = 401;
const AUTHENTICATION_FAILURE_MESSAGE = 'Unauthorised';

function authentication(req, res, done) {
  const header = req.headers['authorization'];
  if (!header) {
    return sendAuthenticationFailure(req, res);
  }
  jwtVerify(req, res, header, done);
}

function parseHeader(header) {
  return header.split(' ')[1];
}

function jwtVerify(req, res, header, done) {
  const token = parseHeader(header);
  jwt.verify(token, jwtSecret, { aud: jwtAudience }, (err, decoded) => {
    if (err) {
      sendAuthenticationFailure(req, res);
    }
    authenticate(req, decoded, done);
  });
}

function sendAuthenticationFailure(req, res) {
  res.status(AUTHENTICATION_FAILURE_STATUS);
  res.json({ message: AUTHENTICATION_FAILURE_MESSAGE });
}

function authenticate(req, decoded, done) {
  req.user = decoded;
  done();
}

module.exports = authentication;
