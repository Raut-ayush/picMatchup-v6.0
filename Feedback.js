import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Feedback.css';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/feedback/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFeedbacks(response.data);
      } catch (error) {
        setError('Failed to retrieve feedback.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="feedback-container">
      <h1>Your Feedback</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {feedbacks.map((feedback) => (
            <li key={feedback._id}>
              <p>{feedback.feedback}</p>
              {feedback.reply && (
                <p className="reply"><strong>Reply:</strong> {feedback.reply}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Feedback;
