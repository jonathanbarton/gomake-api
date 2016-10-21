import express from 'express';
import userRoutes from './user';
import authRoutes from './auth';
import flightRosterRoutes from './flights';
import flightRoutes from './flight';
import config from '../../config/env';
const jwt = require('express-jwt');

const jwtCheck = jwt({
  secret: new Buffer(config.jwtSecret, 'base64'),
  audience: config.jwtAudience
});

const router = express.Router();	// eslint-disable-line new-cap

/** GET /health-check - Check service health */

router.use(jwtCheck);

router.get('/health-check', (req, res) =>
  res.send('OK')
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

// mount flight routes at /flight
router.use('/flights', flightRosterRoutes);

//
router.use('/flight', flightRoutes);

export default router;
