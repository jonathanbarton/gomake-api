import express from 'express';
const flightsCtrl = require('../controllers/flights');
const router = express.Router();	// eslint-disable-line new-cap

/** GET flight roster*/
router.route('/')
  .get(flightsCtrl.getFlights);

export default router;
