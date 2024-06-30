// backend/controllers/adminController.js
const User = require('../models/User');
const config = require('../config');

const resetElo = async (req, res) => {
    try {
        await User.updateMany({}, { eloScore: config.ELO_DEFAULT });
        res.status(200).send('ELO scores reset successfully.');
    } catch (error) {
        console.error('Error resetting ELO scores:', error);
        res.status(500).send('Error resetting ELO scores.');
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const pendingAdmins = await User.find({ isAdminRequest: true, isAdmin: false });
        res.json(pendingAdmins);
    } catch (error) {
        console.error('Error fetching pending admin requests:', error);
        res.status(500).send('Server error');
    }
};

const approveRequest = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.isAdmin = true;
        user.isAdminRequest = false;
        await user.save();

        res.send('Admin request approved');
    } catch (error) {
        console.error('Error approving admin request:', error);
        res.status(500).send('Server error');
    }
};

const denyRequest = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.isAdminRequest = false;
        await user.save();

        res.send('Admin request denied');
    } catch (error) {
        console.error('Error denying admin request:', error);
        res.status(500).send('Server error');
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server error');
    }
};

const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({});
        const totalImages = 100; // This should be replaced with actual logic to count images

        res.json({ totalUsers, totalImages });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    resetElo,
    getPendingRequests,
    approveRequest,
    denyRequest,
    getUsers,
    getAnalytics
};
