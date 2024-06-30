const userService = require('../services/userService');

exports.deleteUser = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await userService.deleteUserByEmail(email);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// controllers/userController.js

exports.getAdminRequests = async (req, res) => {
    try {
        const adminRequests = await User.find({ isAdminRequest: true, isAdmin: { $ne: true } });
        res.status(200).json(adminRequests);
    } catch (error) {
        res.status(400).send(error.message);
    }
};
// controllers/userController.js

exports.approveAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.isAdmin = true;
        user.isAdminRequest = false;
        await user.save();
        res.status(200).send('Admin privileges granted');
    } catch (error) {
        res.status(400).send(error.message);
    }
};
