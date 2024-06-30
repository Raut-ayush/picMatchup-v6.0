const express = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
const upload = multer({ dest: 'profiles/' });

router.put('/', auth, upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.email = req.body.email || user.email;
    if (req.file) {
      user.profilePic = req.file.filename;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

module.exports = router;
