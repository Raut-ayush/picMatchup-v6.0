const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { auth, isAdmin } = require('../middleware/auth');

// Submit feedback
router.post('/submit', auth, async (req, res) => {
  try {
    const feedback = new Feedback({ userId: req.user.id, feedback: req.body.feedback });
    await feedback.save();
    res.status(201).send(feedback);
  } catch (error) {
    res.status(500).send({ error: 'Failed to submit feedback' });
  }
});

// Get all feedback (admin)
router.get('/all', auth, isAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('userId', 'email');
    res.status(200).send(feedbacks);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve feedback' });
  }
});

// Reply to feedback (admin)
router.post('/reply/:id', auth, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    feedback.reply = req.body.reply;
    await feedback.save();
    res.status(200).send(feedback);
  } catch (error) {
    res.status(500).send({ error: 'Failed to reply to feedback' });
  }
});

// Get feedback with replies for a user
router.get('/user', auth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.id });
    res.status(200).send(feedbacks);
  } catch (error) {
    res.status(500).send({ error: 'Failed to retrieve feedback' });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Feedback removed successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to remove feedback' });
  }
});

module.exports = router;
