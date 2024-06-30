// frontend/src/components/AdminDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';
import ChartComponent from '../components/chart.tsx';
import AccountSignature from './AccountSignature';

const AdminDashboard = () => {
    const [pendingAdmins, setPendingAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [image, setImage] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [reply, setReply] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authorization token is missing');
        }
        return token;
    };

    const handleRequestError = (error) => {
        console.error('API Error:', error);
        if (error.response && error.response.data && error.response.data.message) {
            setErrorMessage(`Request failed: ${error.response.data.message}`);
        } else {
            setErrorMessage(`Request failed: ${error.message}`);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const token = getToken();
            const response = await axios.get('http://localhost:3000/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfilePicture(response.data.profilePicture);
        } catch (error) {
            handleRequestError(error);
        }
    };

    const fetchPendingAdminRequests = useCallback(async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get('http://localhost:3000/api/admin/pending-requests', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingAdmins(response.data);
        } catch (error) {
            handleRequestError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get('http://localhost:3000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            handleRequestError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get('http://localhost:3000/api/admin/analytics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnalytics(response.data);
        } catch (error) {
            handleRequestError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFeedbacks = useCallback(async () => {
        setLoading(true);
        try {
            const token = getToken();
            const response = await axios.get('http://localhost:3000/api/feedback/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(response.data);
        } catch (error) {
            handleRequestError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPendingAdminRequests();
        fetchUsers();
        fetchAnalytics();
        fetchFeedbacks();
        fetchUserProfile(); // Fetch user profile when component mounts
    }, [fetchPendingAdminRequests, fetchUsers, fetchAnalytics, fetchFeedbacks]);

    const handleApprove = async (userId) => {
        try {
            const token = getToken();
            await axios.post('http://localhost:3000/api/admin/approve-request', { userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingAdminRequests();
        } catch (error) {
            handleRequestError(error);
        }
    };

    const handleDeny = async (userId) => {
        try {
            const token = getToken();
            await axios.post('http://localhost:3000/api/admin/deny-request', { userId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPendingAdminRequests();
        } catch (error) {
            handleRequestError(error);
        }
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!image) return;

        const formData = new FormData();
        formData.append('image', image);

        try {
            const token = getToken();
            await axios.post('http://localhost:3000/api/admin/upload-image', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Image uploaded successfully');
            fetchUserProfile(); // Fetch the updated profile picture
        } catch (error) {
            handleRequestError(error);
        }
    };

    const handleReply = async (feedbackId) => {
        try {
            const token = getToken();
            await axios.post(`http://localhost:3000/api/feedback/reply/${feedbackId}`, { reply }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReply('');
            fetchFeedbacks();
        } catch (error) {
            handleRequestError(error);
        }
    };

    const handleRemoveFeedback = async (feedbackId) => {
        try {
          const token = localStorage.getItem('token');
          console.log(`Attempting to remove feedback with ID: ${feedbackId}`);
          await axios.delete(`http://localhost:3000/api/feedback/${feedbackId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchFeedbacks(); // Refresh feedback list after deletion
        } catch (error) {
          handleRequestError(error);
        }
      };
      
    const userRolesChart = {
        type: 'bar',
        data: {
            labels: users.map(user => user.email),
            datasets: [
                {
                    label: 'User Roles',
                    data: users.map(user => user.role === 'admin' ? 1 : 0),
                    backgroundColor: 'rgba(75,192,192,0.6)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Users'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Roles'
                    }
                }
            }
        }
    };

    const userRolesDistributionChart = {
        type: 'pie',
        data: {
            labels: ['Admin', 'User'],
            datasets: [
                {
                    data: [
                        users.filter(user => user.role === 'admin').length,
                        users.filter(user => user.role === 'user').length,
                    ],
                    backgroundColor: ['rgba(75,192,192,0.6)', 'rgba(255,99,132,0.6)'],
                }
            ]
        },
        options: {
            responsive: true,
        }
    };

    const userRegistrationTrendChart = {
        type: 'line',
        data: {
            labels: analytics.registrationDates?.map(date => new Date(date).toLocaleDateString()) || [],
            datasets: [
                {
                    label: 'Registrations',
                    data: analytics.registrationCounts || [],
                    fill: false,
                    borderColor: 'rgba(75,192,192,1)',
                }
            ]
        },
        options: {
            responsive: true,
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Admin Dashboard</h2>
            <AccountSignature profilePicture={profilePicture} /> {/* Add AccountSignature component */}
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h3>Pending Admin Requests</h3>
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <ul className="list-group">
                                    {pendingAdmins.map(admin => (
                                        <li className="list-group-item d-flex justify-content-between align-items-center" key={admin._id}>
                                            {admin.email} - {admin.userId}
                                            <div>
                                                <button className="btn btn-success btn-sm mx-1" onClick={() => handleApprove(admin._id)}>Approve</button>
                                                <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDeny(admin._id)}>Deny</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h3>User Management</h3>
                            <ul className="list-group">
                                {users.map(user => (
                                    <li className="list-group-item" key={user._id}>
                                        {user.email} - {user.role}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h3>Analytics</h3>
                            <div className="analytics">
                                <p>Total Users: {analytics.totalUsers}</p>
                                <p>Total Images: {analytics.totalImages}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h3>Image Upload</h3>
                            <form onSubmit={handleImageUpload}>
                                <div className="mb-3">
                                    <input className="form-control" type="file" onChange={(e) => setImage(e.target.files[0])} />
                                </div>
                                <button className="btn btn-primary" type="submit">Upload</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h3>User Roles Distribution</h3>
                            <ChartComponent config={userRolesDistributionChart} />
                        </div>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h3>User Registration Trend</h3>
                            <ChartComponent config={userRegistrationTrendChart} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-12 mb-4">
                    <div className="card">
                        <div className="card-body">
                            <h3>Feedback</h3>
                            <ul className="list-group">
                                {feedbacks.map(feedback => (
                                    <li className="list-group-item d-flex justify-content-between align-items-center" key={feedback._id}>
                                        <div>
                                            <p>{feedback.feedback}</p>
                                            {feedback.reply && (
                                                <p className="reply"><strong>Reply:</strong> {feedback.reply}</p>
                                            )}
                                            <textarea
                                                className="form-control"
                                                placeholder="Write a reply..."
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                            ></textarea>
                                            <button className="btn btn-primary mt-2" onClick={() => handleReply(feedback._id)}>Reply</button>
                                        </div>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleRemoveFeedback(feedback._id)}>Remove</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
