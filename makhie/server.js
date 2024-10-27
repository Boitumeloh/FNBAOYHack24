const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const { protect } = require('./middleware/authMiddleware'); // Import the protect middleware
const mongoose = require('mongoose');
const session = require('express-session');
const Business = require('./models/Business');
const businessController = require('./controllers/businessController'); // assuming you have a controller for business logic
const router = express.Router();


const User = require('./models/User');

dotenv.config();

const app = express();
app.use(express.json());

// Database connection
connectDB();

// Middleware for parsing request bodies
app.use(express.urlencoded({ extended: true }));

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure views directory path

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration 
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to `true` if using HTTPS
  })
);

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/businesses', require('./routes/businessRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/risks', require('./routes/riskRoutes'));


// Serve the index.html file for the default route ('/')
app.get('/', (req, res) => {
  res.render('landinghome');
});

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//       const user = await User.findOne({ username });
//       if (user && user.password === password) { // Use hashing in production
//           req.session.userId = user._id; // Store user ID in session
//           return res.redirect('/dashboard'); // Redirect to dashboard
//       }
//       res.status(401).send('Invalid credentials');
//   } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal server error');
//   }
// });

// Serve the registration page
app.get('/register', (req, res) => {
  res.render('register'); // Automatically looks for register.ejs in the views folder
});

// Route to get businesses page
app.get('/businesses', require('./controllers/businessController').getBusinessesPage);

// Protect /home and /dashboard routes
app.get('/home', (req, res) => {
  res.render('home'); // This should match the home.ejs file
});

// Route handler for dashboard
app.get('/dashboard', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/login'); // Redirect to login if no user ID found
    }

    // Query the database for the user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
        return res.status(404).send('User not found'); // Handle the case where user is not found
    }

    // Send user data to the EJS file
    res.render('dashboard', { user });
} catch (error) {
    console.error(error);
    res.status(500).send('Internal server error'); // Handle errors
}
});

// Serve the investment page
app.get('/invest', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'invest.html'));
});

app.get('/about', async (req, res) => {
    try {
        // Attempt to fetch the business data from the database
        const business = await Business.findOne({ business_name: 'Eco Solutions' });

        // Check if the business was found
        if (!business) {
            return res.status(404).send("Business not found");
        }

        // Pass the business object to the about.ejs view if found
        res.render('about', { business });
    } catch (error) {
        console.error("Error fetching business data:", error);
        res.status(500).send("Server Error");
    }
});

// Route for business registration
router.post('/api/businesses/register', businessController.registerBusiness);

app.get('/business-register', (req, res) => {
  res.render('businessRegister'); // Renders the businessRegister.ejs file
});
// Catch-All for Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
