// backend/routes/authRoutes.js
const express = require('express');
const multer = require('multer');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth'); // Ensure auth is correctly imported as a function

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('image'), authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/reset-password', authController.resetPassword);
router.get('/me', auth, authController.getMe);
router.post('/update', auth, authController.upload.single('profilePicture'), authController.updateProfile);

module.exports = router;
