// backend/routes/resetRoutes.js
const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth'); // Adjusted import if `adminAuth` is combined in auth.js
const { resetState, resetElo } = require('../controllers/resetController');

router.post('/elo', [auth, isAdmin], resetElo); // Combined auth and admin check middleware
router.post('/', auth, resetState);

module.exports = router;
