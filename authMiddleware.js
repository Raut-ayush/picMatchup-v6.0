// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

exports.isAdmin = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access denied');

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user.role !== 'admin') return res.status(403).send('Access forbidden: Admins only');
        req.user = user;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token');
    }
};
