// frontend/src/pages/FeedbackPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/feedback/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to retrieve feedbacks:', error);
      setMessage('Failed to retrieve feedbacks.');
      setIsLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (feedback.trim()) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:3000/api/feedback/submit', { feedback }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Thank you for your feedback!');
        setFeedback('');
        fetchFeedbacks();
      } catch (error) {
        console.error('Failed to submit feedback:', error);
        setMessage('Failed to submit feedback.');
      }
    } else {
      setMessage('Please enter your feedback before submitting.');
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-list-container">
        <h2>All Feedbacks</h2>
        {isLoading ? (
          <p>Loading feedbacks...</p>
        ) : feedbacks.length === 0 ? (
          <p>No feedbacks found.</p>
        ) : (
          <ul className="feedback-list">
            {feedbacks.map(fb => (
              <li key={fb._id}>
                <p><strong>{fb.userId.email}:</strong> {fb.feedback}</p>
                {fb.reply && <p className="reply"><strong>Reply:</strong> {fb.reply}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="new-feedback-container">
        <h2>Submit Your Feedback</h2>
        <form onSubmit={handleFeedbackSubmit} className="feedback-form">
          <label htmlFor="feedback">Enter your feedback:</label>
          <textarea
            id="feedback"
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        {message && <p className="feedback-message">{message}</p>}
      </div>
    </div>
  );
};

export default FeedbackPage;
