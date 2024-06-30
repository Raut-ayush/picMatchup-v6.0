// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import Login from './Login';
import Register from './Register';
import Footer from './Footer';
import AdminDashboard from './components/AdminDashboard';
import FeedbackPage from './pages/FeedbackPage';
import AccountSettings from './pages/AccountSettings';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import AccountSignature from './components/AccountSignature';

const App = () => {
  const [images, setImages] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [choiceData, setChoiceData] = useState([]);
  const [showPreferences, setShowPreferences] = useState(false);
  const [eloList, setEloList] = useState([]);
  const [showEloList, setShowEloList] = useState(false);
  const [topEloRatings, setTopEloRatings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogin, setShowLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/images', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setImages(response.data.images);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching images:', error);
      setLoading(false);
    }
  };

  const fetchEloList = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/elo', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEloList(response.data);
      setShowEloList(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ELO list:', error);
      setLoading(false);
    }
  };

  const fetchTopEloRatings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/elo', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTopEloRatings(response.data.slice(0, 3));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching top ELO ratings:', error);
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsAdmin(response.data.isAdmin);
      setProfilePicture(response.data.profilePicture);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleStartStop = () => {
    if (isRunning) {
      setShowPreferences(true);
      fetchTopEloRatings();
    } else {
      setChoiceData([]);
    }
    setIsRunning(!isRunning);
  };

  const handleImageClick = (selectedImage) => {
    if (!isRunning) return;

    const otherImage = images.find(img => img !== selectedImage);
    const choice = { choice: selectedImage, other: otherImage };
    setChoiceData([...choiceData, choice]);

    axios.post('http://localhost:3000/api/images/choice', choice, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        fetchImages();
      })
      .catch(error => {
        console.error('Error recording choice:', error);
      });
  };

  const handleResetElo = () => {
    axios.post('http://localhost:3000/api/reset/elo', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setEloList([]);
        setTopEloRatings([]);
        setShowEloList(false);
        setShowPreferences(false);
        setErrorMessage('');
      })
      .catch(error => {
        console.error('Error resetting ELO scores:', error);
        if (error.response && error.response.status === 403) {
          alert('You do not have permission to reset ELO scores.');
        } else {
          alert('Failed to reset ELO scores. You may not have the required permissions.');
        }
      });
  };

  const resetState = () => {
    axios.post('http://localhost:3000/api/reset', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setImages([]);
        setErrorMessage('');
      })
      .catch(error => {
        console.error('Error resetting state:', error);
        if (error.response && error.response.status === 403) {
          alert('You do not have permission to reset the state.');
        } else {
          alert('Failed to reset state. You may not have the required permissions.');
        }
      });
  };

  const handleQuit = () => {
    setIsAuthenticated(false);
    setIsAdmin(false); // Reset admin state on logout
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedEloList = eloList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && isRunning) {
      fetchImages();
      setShowPreferences(false);
      setShowEloList(false);
    } else if (isAuthenticated) {
      resetState();
    }
  }, [isAuthenticated, isRunning]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isRunning) {
        if (event.key === 'ArrowLeft') {
          handleImageClick(images[0]);
        } else if (event.key === 'ArrowRight') {
          handleImageClick(images[1]);
        }
      }
      if (event.key === 'Enter' || event.key === 'Escape') {
        setIsRunning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRunning, images, handleImageClick]);

  return (
    <div className="App">
      <ErrorBoundary>
        <header className="header">
          <h1>Image Comparison</h1>
          {isAuthenticated && <AccountSignature profilePicture={profilePicture} />}
        </header>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <div className="main-content">
          <Routes>
            <Route path="/" element={
              !isAuthenticated ? (
                <div className="auth-wrapper">
                  {showLogin ? (
                    <>
                      <Login setIsAuthenticated={setIsAuthenticated} />
                      <p>New to Image Comparison? <button onClick={() => setShowLogin(false)}>Register here</button></p>
                    </>
                  ) : (
                    <Register setIsAuthenticated={setIsAuthenticated} setShowLogin={setShowLogin} />
                  )}
                </div>
              ) : (
                <div className="container">
                  <h1>Image Comparison</h1>
                  {!isRunning && !showPreferences && !showEloList && (
                    <div className="centered-container">
                      <button onClick={handleStartStop}>Start</button>
                      <p>Click "Start" to begin the comparison.</p>
                      <button onClick={handleQuit}>Quit</button>
                      {isAdmin && (
                        <>
                          <button className="admin-dashboard-button" onClick={() => navigate('/admin')}>Admin Dashboard</button>
                          <p className="admin-message">Click here to access the Admin Dashboard</p>
                        </>
                      )}
                    </div>
                  )}
                  {isRunning && (
                    <>
                      {loading ? <p>Loading images...</p> : (
                        <div className="image-container">
                          {images.map((image, index) => (
                            <img key={index} src={`http://localhost:3000/images/${image}`} alt={`Comparison ${index + 1}`} onClick={() => handleImageClick(image)} />
                          ))}
                        </div>
                      )}
                      <button onClick={handleStartStop}>Stop</button>
                    </>
                  )}
                  {showPreferences && !isRunning && (
                    <>
                      <div className="preferences">
                        <h1>Preferences</h1>
                        <ul>
                          {choiceData.length === 0 ? (
                            <li>Make choices</li>
                          ) : (
                            choiceData.map((choice, index) => (
                              <li key={index}>
                                <strong>Preferred:</strong> <img src={`http://localhost:3000/images/${choice.choice}`} alt={`Choice ${index + 1}`} width="100" />
                                <strong>Other:</strong> <img src={`http://localhost:3000/images/${choice.other}`} alt={`Other ${index + 1}`} width="100" />
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                      <div className="top-elo">
                        <h2>Top 3 ELO Rated Images</h2>
                        <ul>
                          {topEloRatings.length === 0 ? (
                            <li>Make choices</li>
                          ) : (
                            topEloRatings.map((item, index) => (
                              <li key={index}>
                                <img src={`http://localhost:3000/images/${item.image}`} alt={`Top ELO ${index + 1}`} width="100" />
                                - ELO: {item.elo}
                              </li>
                            ))
                          )}
                        </ul>
                        <button onClick={fetchEloList}>View List of ELO Rankings</button>
                        <button onClick={handleResetElo}>Reset ELO Scores</button>
                        <button onClick={handleStartStop}>Retake Test</button>
                        <button onClick={handleQuit}>Quit</button>
                        <button onClick={() => navigate('/feedback')}>Feedback</button>
                      </div>
                    </>
                  )}
                  {showEloList && (
                    <div>
                      <div className="elo-list">
                        <h2>ELO Rankings</h2>
                        {loading ? <p>Loading rankings...</p> : (
                          <ul>
                            {paginatedEloList.length === 0 ? (
                              <li>Make choices</li>
                            ) : (
                              paginatedEloList.map((item, index) => (
                                <li key={index}>
                                  <img src={`http://localhost:3000/images/${item.image}`} alt={`ELO ${index + 1}`} width="100" />
                                  - ELO: {item.elo}
                                </li>
                              ))
                            )}
                          </ul>
                        )}
                        <div className="pagination">
                          {Array.from({ length: Math.ceil(eloList.length / itemsPerPage) }, (_, i) => (
                            <button key={i} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {showEloList && (
                    <div className="buttons-below-elo-list">
                      <button onClick={handleResetElo}>Reset ELO Scores</button>
                      <button onClick={handleStartStop}>Retake Test</button>
                      <button onClick={handleQuit}>Quit</button>
                      <button onClick={() => navigate('/feedback')}>Feedback</button>
                    </div>
                  )}
                </div>
              )
            } />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

export default App;
