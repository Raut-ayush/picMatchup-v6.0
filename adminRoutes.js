// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getPendingRequests, approveRequest, denyRequest, resetElo, getUsers, getAnalytics } = require('../controllers/adminController');
const { auth, isAdmin } = require('../middleware/auth');

// Define the routes
router.get('/pending-requests', [auth, isAdmin], getPendingRequests);
router.post('/approve-request', [auth, isAdmin], approveRequest);
router.post('/deny-request', [auth, isAdmin], denyRequest);
router.post('/reset-elo', [auth, isAdmin], resetElo);
router.get('/users', [auth, isAdmin], getUsers);
router.get('/analytics', [auth, isAdmin], getAnalytics);

module.exports = router;
