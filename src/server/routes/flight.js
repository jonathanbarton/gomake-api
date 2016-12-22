import express from 'express';
import validate from 'express-validation';
import telemetryCtrl from '../controllers/telemetry';
import flightInfoCtrl from '../controllers/flight';
import historyCtrl from '../controllers/history';
import paramValidation from '../../config/param-validation';
import config from '../../config/env';
const jwt = require('express-jwt');

const jwtCheck = jwt({
  secret: new Buffer(config.jwtSecret),
  audience: config.jwtAudience
});

const router = express.Router();	// eslint-disable-line new-cap

/** GET flight */
router.route('/:flightname')
  .get(validate(paramValidation.flightInfo), jwtCheck, flightInfoCtrl.getFlightInfo);

/** GET flight telemetry */
router.route('/:flightname/telemetry')
      .get(validate(paramValidation.telemetry), telemetryCtrl.getTelemetry);

/** POST flight telemetry */
router.route('/:flightname/telemetry')
  .post(validate(paramValidation.telemetry), telemetryCtrl.postTelemetry);

/** GET flight telemetry */
router.route('/:flightname/history')
  .get(validate(paramValidation.history), historyCtrl.getFlightHistory);

export default router;
