'use strict';

// import config from '../../config/env';
// const jwt = require('jsonwebtoken');
// const jwtSecret = config.jwtSecret;
// const jwtAudience = config.jwtAudience;
const AUTHENTICATION_FAILURE_STATUS = 401;
const AUTHENTICATION_FAILURE_MESSAGE = 'Unauthorised';
const request = require('request');

function authentication(req, res, done) {
  const header = req.headers['authorization'];
  if (!header) {
    return sendAuthenticationFailure(req, res);
  }
  jwtVerify(req, res, header, done);
}

// function parseHeader(header) {
//   return header.split(' ')[1];
// }

function jwtVerify(req, res, header) {
  // const token = parseHeader(header);

  var options = { method: 'GET',
  url: 'https://gomake.auth0.com/api/v2/users',
  headers: { authorization: `${header}` } };

  console.log(header);

  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    console.log(body);
  });

  // const url = `https://gomake.auth0.com/authorize?response_type=token&client_id=KxwSnu3NgCtJKbtSXYc4gFtTOhgDn1rw`;
  // request.get(url, (err, res, body) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   console.log(body);
  //   if (res.statusCode !== 200) {
  //     res.json({ body });
  //     // console.log(body);
  //     console.log('I am here');
  //   }
  // });

  // jwt.verify(token, jwtSecret, { aud: jwtAudience }, (err, decoded) => {
  //   if (err) {
  //     sendAuthenticationFailure(req, res);
  //   }
  //   authenticate(req, decoded, done);
  // });
}

function sendAuthenticationFailure(req, res) {
  res.status(AUTHENTICATION_FAILURE_STATUS);
  res.json({ message: AUTHENTICATION_FAILURE_MESSAGE });
}

// function authenticate(req, decoded, done) {
//   req.user = decoded;
//   done();
// }

module.exports = authentication;
