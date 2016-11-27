export default {
  env: process.env.NODE_ENV,
  jwtSecret: process.env.GM_JWT_SECRET,
  jwtAudience: process.env.GM_JWT_AUDIENCE,
  db: process.env.GM_DB,
  port: process.env.GM_PORT
};
