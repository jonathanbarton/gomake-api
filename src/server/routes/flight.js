import express from 'express';
import validate from 'express-validation';
import telemetryCtrl from '../controllers/telemetry';
import flightInfoCtrl from '../controllers/flight';
import historyCtrl from '../controllers/history';
import chat from '../controllers/chat';
import paramValidation from '../../config/param-validation';
import authentication from '../middleware/authentication';

const router = express.Router();	// eslint-disable-line new-cap

/** GET flight */
router.route('/:flightname')
  .get(validate(paramValidation.flightInfo), authentication, flightInfoCtrl.getFlightInfo);

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

/** POST flight chat: create group_channel for flight if does not exist */
router.route('/:flightname/chat')
  .post(validate(paramValidation.chat), chat.createFlightChannel);

/** GET flight chat: get group_channel for flight */
router.route('/:flightname/chat')
  .get(validate(paramValidation.chat), chat.getFlightChannel);

/** POST flight user ids: create group_channel for flight if does not exist */
router.route('/:flightname/users/:userId')
  .post(validate(paramValidation.chat), chat.createFlightChannel);

/** GET flight user ids: get group_channel for flight */
router.route('/:flightname/users/:userId')
  .get(validate(paramValidation.chat), chat.getFlightChannel);

export default router;
