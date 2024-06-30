const authService = require('../services/authService');
const User = require('../models/User');
const multer = require('multer');

// Set up multer for profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

exports.register = async (req, res) => {
  try {
    const newUser = await authService.registerUser(req.body, req.file);
    res.status(201).send('User registered. Verification email sent.');
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.login = async (req, res) => {
  try {
    const { token } = await authService.loginUser(req.body.login, req.body.password);
    res.json({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const result = await authService.verifyEmail(req.body.email, req.body.verificationCode);
    res.status(200).send(result.message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body.email, req.body.newPassword);
    res.status(200).send(result.message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.email = req.body.email || user.email;

    if (req.file) {
      user.profilePicture = `uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', profilePicture: user.profilePicture });
  } catch (error) {
    console.error('Error updating profile:', error); // Add console log for error
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

module.exports.upload = upload;
