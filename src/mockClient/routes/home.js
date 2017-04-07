import express from 'express';
import passportStrategy from '../../mockClient/middleware/passportStrategy';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
const router = express.Router(); // eslint-disable-line new-cap

// Render Client Home View
router.get('/',
  passportStrategy.authenticate('auth0', {
    session: false
  }), renderResponse);

function renderResponse(req, res) {
  if (!req.user) {
    throw new Error('user null');
  }
  sendNewToken(req, res);
}

function sendNewToken(req, res) {
  const newUser = {
    email: req.user._json.email,
    user_id: req.user._json.user_id,
    roles: req.user._json.roles
  };
  const newToken = jwt.sign(newUser, config.jwtSecret, {
    audience: config.jwtAudience
  });
  req.session.token = newToken;
  console.log('NEW TOKEN: ');
  console.log('======================================================');
  console.log(newToken);
  console.log('======================================================');
  res.render('home');
}

export default router;
