import jwt from 'jsonwebtoken';
const config = require('../../../../src/config/env');

const user = {
  name: 'Neha',
  user_id: 'google|12345'
};

function generateJwtToken(hasExpiration, hasUserId) {
  console.log(`SECRET NOT SO SECRET ${config.jwtSecret}`);
  const newUser = hasUserId ? user : {
    name: 'Neha'
  };
  const newToken = !hasExpiration ? jwt.sign(newUser, config.jwtSecret) : jwt.sign(newUser,
    config.jwtSecret, {
      expiresIn: '0.1'
    });
  return newToken;
}

module.exports = {
  generateJwtToken
};
