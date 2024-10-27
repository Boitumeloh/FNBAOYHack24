const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
    let token;

    // Check if token is provided in the Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extract the token from the header
    } else {
        return res.redirect('/login'); // Redirect if no token is found
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user object to the request (excluding the password)
        req.user = await User.findById(decoded.id).select('-password');

        // Log the user information to the console
        console.log('Authenticated User:', req.user); // Logging the authenticated user

        // Check if the user exists
        if (!req.user) {
            return res.redirect('/login'); // Redirect if user not found
        }

        next(); // Token is valid, proceed to the next middleware/route
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.redirect('/login'); // Redirect to login if token is invalid
    }
};
