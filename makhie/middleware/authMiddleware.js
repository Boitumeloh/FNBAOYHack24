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

            // Allow access to the next middleware or route handler
            return next();
        } catch (error) {
            console.error('Token verification failed:', error);
            // Redirect to login if token verification fails
            return res.redirect('/login');
        }
    }

    // Redirect to login if no token is provided
    if (!token) {
        return res.redirect('/login');
    }
};
