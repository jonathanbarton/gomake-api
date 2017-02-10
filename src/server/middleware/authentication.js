'use strict';

import config from '../../config/env';
// MS: const jwt = require('jsonwebtoken');
// MS: const jwtSecret = config.jwtSecret;
const AUTHENTICATION_FAILURE_STATUS = 401;
const AUTHENTICATION_FAILURE_MESSAGE = 'Unauthorised';

// MS: function authentication(req, res, done) {
function authentication(req, res) {
  const header = req.headers['authorization'];
  if (!header) {
    return sendAuthenticationFailure(req, res);
  }
  // MS: jwtVerify(req, res, header, done);
}

// MS:
// function parseHeader(header) {
//   return header.split(' ')[1];
// }

// MS
// function jwtVerify(req, res, header, done) {
//   const token = parseHeader(header);
//   jwt.verify(token, jwtSecret, (err, decoded) => {
//     console.log('err');
//     console.log(err);
//     console.log('-----');
//     console.log('decoded');
//     console.log(decoded);
//     console.log('=====');

//     if (err) {
//       sendAuthenticationFailure(req, res);
//     }
//     authenticate(req, decoded, done);
//   });
// }

function sendAuthenticationFailure(req, res) {
  res.status(AUTHENTICATION_FAILURE_STATUS);
  res.json({ message: AUTHENTICATION_FAILURE_MESSAGE });
}

// MS:
// function authenticate(req, decoded, done) {
//   req.user = decoded;
//   done();
// }

module.exports = authentication;
