import express from 'express';
import flightRosterRoutes from './flights';
import flightRoutes from './flight';
import auth0Routes from './auth0';
import authentication from '../middleware/authentication';

const router = express.Router();	// eslint-disable-line new-cap

router.get('/', (req, res) => {
  res.sendStatus(403);
});

router.get('/health-check', (req, res) => {
  res.send('OK');
});

// mount flights routes at /flights
router.use('/flights', authentication, flightRosterRoutes);

// mount flight routes at /flight
router.use('/flight', flightRoutes);

// routes for /auth0 (Just needed for JADE app as auth0 takes care of the authentication)
router.use('/auth0', auth0Routes);

export default router;
