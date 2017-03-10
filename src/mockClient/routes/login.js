import express from 'express';
import config from '../../config/env';
const router = express.Router();	// eslint-disable-line new-cap

// Render Client Login View
router.get('/', (req, res) => {
  res.render('login', { config });
});

export default router;
