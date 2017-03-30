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
  const newToken = jwt.sign(req.user._json, config.jwtSecret, {
    audience: config.jwtAudience
  });
  console.log(`TOKEN:  ${newToken}`);
  req.session.token = newToken;
  res.render('home');
}

export default router;
