const express = require('express');
const router = express.Router();
const { getTopEloRatings, getEloRatings, resetEloScores, updateElo } = require('../controllers/eloController');
const adminAuth = require('../middleware/adminAuth');

router.get('/top', getTopEloRatings);
router.get('/', getEloRatings);
router.post('/update', updateElo);
router.post('/reset', adminAuth, resetEloScores); // Apply adminAuth middleware

module.exports = router;
