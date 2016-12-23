import express from 'express';
import config from '../../config/env';
import jwt from 'jsonwebtoken';
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const TOKEN_EXPIRY = 360;
const router = express.Router();	// eslint-disable-line new-cap

// Configure passport
const strategy = new Auth0Strategy({
  domain: config.auth0Domain,
  clientID: config.jwtAudience,
  clientSecret: config.jwtSecret,
  callbackURL: config.auth0CallbackUrl
}, (accessToken, refreshToken, extraParams, profile, done) => {
  // accessToken is the token to call Auth0 API (not needed in the most cases)
  // extraParams.id_token has the JSON Web Token
  // profile has all the information from the user
  return done(null, profile);
});

passport.use(strategy);

// Render Auth0 Index View
router.get('/', (req, res) => {
  res.render('auth0/index', { config });
});

// Use Passport (This is the callback route that user is taken to after auth0 authentication)
router.get('/login',
  passport.authenticate('auth0', {
    session: false
  }),
  (req, res) => {
    if (!req.user) {
      throw new Error('user null');
    }
    const token = jwt.sign(req.user, config.jwtSecret, {
      audience: config.jwtAudience
    });
    res.json({
      token,
      TOKEN_EXPIRY
    });
  }
);


export default router;
