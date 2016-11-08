export default {
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  jwtAudience: process.env.JWT_AUDIENCE,
  db: process.env.DB,
  port: process.env.PORT
};
