import express from 'express';
import session from 'express-session';
import flightRosterRoutes from './flights';
import flightRoutes from './flight';
import login from '../../mockClient/routes/login';
import adminDashboard from '../../mockClient/routes/adminDashboard';
import home from '../../mockClient/routes/home';
import authentication from '../middlewares/authentication';
import config from '../../config/env';
import responseSerialization from '../middlewares/responseSerialization';

const MAX_AGE = 600000; // milliseconds

const router = express.Router(); // eslint-disable-line new-cap

router.get('/', (req, res) => {
  res.send('<img src="https://media.giphy.com/media/w3J7mstYCISqs/giphy.gif" />');
});

router.get('/health-check', (req, res) => {
  res.send('OK');
});

router.get('/loaderio-c24916f32168b67b7ca7f66569a22643', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('loaderio-c24916f32168b67b7ca7f66569a22643');
});

router.use(session({ resave: true, saveUninitialized: true, secret: config.jwtSecret,
   cookie: { maxAge: MAX_AGE } }));

router.use(responseSerialization);

// mount flights routes at /flights
router.use('/flights', authentication, flightRosterRoutes);

// mount flight routes at /flight
router.use('/flight', authentication, flightRoutes);


/* ************* ROUTES FOR JADE APP *********************************/

// routes for /login (Just needed for JADE app.Will live in app otherwise.)
router.use('/login', login);

// routes for doing all admin stuff (Just needed for JADE app Will live in app otherwise.)
router.use('/adminDashboard', adminDashboard);

// This is the callback route that user is taken to after auth0 authentication.
// (Just needed for JADE app Will live in app otherwise.)
router.use('/home', home);


export default router;
