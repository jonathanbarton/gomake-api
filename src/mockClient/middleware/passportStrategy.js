import config from '../../config/env';
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

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

const passportStrategy = passport.use(strategy);

export default passportStrategy;
