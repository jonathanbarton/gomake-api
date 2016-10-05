import express from 'express';
import flightsCtrl from '../controllers/flights';

const router = express.Router();	// eslint-disable-line new-cap

/** GET flight roster*/
router.route('/')
  .get(flightsCtrl.list);


export default router;
