import express from 'express';
import validate from 'express-validation';
import telemetryCtrl from '../controllers/telemetry';
import flightInfoCtrl from '../controllers/flight';
import historyCtrl from '../controllers/history';
import paramValidation from '../../config/param-validation';

const router = express.Router();	// eslint-disable-line new-cap

/** GET flight */
router.route('/:flightname')
  .get(validate(paramValidation.flightInfo), flightInfoCtrl.getFlightInfo);

/** POST flight */
router.route('/:flightname')
  .post(validate(paramValidation.flightInfo), flightInfoCtrl.postFlightInfo);


/** GET flight telemetry */
router.route('/:flightname/telemetry')
      .get(validate(paramValidation.telemetry), telemetryCtrl.getTelemetry);

/** POST flight telemetry */
router.route('/:flightname/telemetry')
  .post(validate(paramValidation.telemetry), telemetryCtrl.postTelemetry);

/** GET flight telemetry */
router.route('/:flightname/history')
  .get(validate(paramValidation.history), historyCtrl.getFlightHistory);

/** PUT userId in existing flight */
router.route('/:flightname/user/:userid')
  .put(validate(paramValidation.userForFlight), flightInfoCtrl.putUserInFlight);

/** DELETE userId in existing flight */
router.route('/:flightname/user/:userid')
  .delete(validate(paramValidation.userForFlight), flightInfoCtrl.deleteUserInFlight);

export default router;
