export default {
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  db: process.env.DB,
  port: process.env.PORT
};
