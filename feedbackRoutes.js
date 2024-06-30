// backend/routes/feedbackRoutes.js
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

// Get all feedback (accessible to any authenticated user)
router.get('/all', auth, async (req, res) => {
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

// Remove feedback (admin)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    console.log(`Attempting to remove feedback with ID: ${req.params.id}`); // Log the feedback ID
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).send({ error: 'Feedback not found' });
    }
    res.status(200).send({ message: 'Feedback removed' });
  } catch (error) {
    console.error('Failed to remove feedback:', error); // Log the error
    res.status(500).send({ error: 'Failed to remove feedback' });
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

module.exports = router;
