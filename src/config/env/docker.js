export default {
  env: process.env.NODE_ENV,
  jwtSecret: new Buffer(process.env.GM_JWT_SECRET, 'base64'),
  jwtAudience: process.env.GM_JWT_AUDIENCE,
  auth0Domain: process.env.GM_AUTH0_DOMAIN,
  auth0CallbackUrl: process.env.GM_AUTH0_CALLBACK_URL,
  db: process.env.GM_DB,
  port: process.env.GM_PORT
};
