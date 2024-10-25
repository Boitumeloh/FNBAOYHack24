const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    let token;

    // Check if token is provided in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from the "Bearer" token string
            token = req.headers.authorization.split(' ')[1];

            // Decode the token to get the user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user object to the request (excluding the password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move to the next middleware or route handler
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
