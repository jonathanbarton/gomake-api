import express from 'express';
import mockClientAuthentication from '../../mockClient/middleware/authentication';
const router = express.Router();	// eslint-disable-line new-cap

// Render Client adminDashboard View
router.get('/', mockClientAuthentication, (req, res) => {
  res.render('adminDashboard');
});

export default router;
