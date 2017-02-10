import express from 'express';
import validate from 'express-validation';
import chat from '../controllers/chat';
import paramValidation from '../../config/param-validation';
// import authentication from '../middleware/authentication';

const router = express.Router();	// eslint-disable-line new-cap

/** POST flight chat: create group_channel for flight if does not exist */
router.route('/:flightname/chat')
  .post(validate(paramValidation.chat), chat.createFlightChannel);

// /** DELETE flight chat: remove group_channel for flight if does not exist */
// router.route('/:flightname/chat')
//   .delete(validate(paramValidation.history), historyCtrl.getFlightHistory);
//
// /** GET users for chat for flight */
// router.route('/:flightname/chat/users')
//  .get(validate(paramValidation.history), historyCtrl.getFlightHistory);
//
// /** GET user for user_id in chat for flight */
// router.route('/:flightname/chat/users/:userId')
//   .get(validate(paramValidation.history), historyCtrl.getFlightHistory);
//
// /** GET users for chat for flight */
// router.route('/:flightname/chat/users')
//   .get(validate(paramValidation.history), historyCtrl.getFlightHistory);

export default router;
