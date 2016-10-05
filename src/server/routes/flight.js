import express from 'express';
import flightCtrl from '../controllers/flight';

const router = express.Router();	// eslint-disable-line new-cap

/** GET flight roster*/
router.route('/')
  .get(flightCtrl.list);


export default router;
