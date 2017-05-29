'use strict';

import config from '../../config/env';

const jwt = require('jsonwebtoken');
const jwtSecret = config.jwtSecret;
const jwtAudience = config.jwtAudience;
const NO_TOKEN_PRESENT = 'No token present';

function authentication(req, res, done) {
  const header = req.headers['authorization'];
  const query = req.query['authorization'];
  const token = header ? parseHeader(header) : query;

  if (header || query) {
    return jwtVerify(req, res, token, done);
  }
  return res.authenticationFailure(res, req, NO_TOKEN_PRESENT);
}

function parseHeader(header) {
  return header.split(' ')[1];
}

function jwtVerify(req, res, token, done) {
  jwt.verify(token, jwtSecret, {
    algorithms: ['HS256'],
    type: 'JWT',
    aud: jwtAudience
  }, (err, decoded) => {
    if (err) {
      return res.authenticationFailure(res, req, err);
    }
    req.user = decoded;
    authenticate(req, res, done);
  });
}

function authenticate(req, res, done) {
  res.authenticationSuccess(req, done);
}

module.exports = authentication;
