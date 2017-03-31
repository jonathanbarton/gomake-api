'use strict';

import config from '../../config/env';
import logger from '../utils/logger';

const jwt = require('jsonwebtoken');
const jwtSecret = config.jwtSecret;
const AUTHENTICATION_FAILURE_STATUS = 401;
const AUTHENTICATION_FAILURE_MESSAGE = 'Unauthorised';

function authentication(req, res, done) {
  const header = req.headers['authorization'];
  const query = req.query['authorization'];
  const token = header ? parseHeader(header) : query;

  if (header || query) {
    return jwtVerify(req, res, token, done);
  }
  return sendAuthenticationFailure(req, res);
}

function parseHeader(header) {
  return header.split(' ')[1];
}

function jwtVerify(req, res, token, done) {
  jwt.verify(token, jwtSecret, {
    algorithms: ['HS256'],
    type: 'JWT'
  }, (err, decoded) => {
    if (err) {
      logger.logAuthenticationDenial(req);
      return sendAuthenticationFailure(req, res);
    }
    authenticate(req, decoded, done);
  });
}

function authenticate(req, decoded, done) {
  req.user = decoded;
  logger.logAuthenticationSuccess(req);
  done();
}

function sendAuthenticationFailure(req, res) {
  res.status(AUTHENTICATION_FAILURE_STATUS);
  res.json({
    message: AUTHENTICATION_FAILURE_MESSAGE
  });
}

module.exports = authentication;
