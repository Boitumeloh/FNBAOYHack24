const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const { protect } = require('./middleware/authMiddleware'); // Import the protect middleware
const session = require('express-session');
const Business = require('./models/Business');
const businessController = require('./controllers/businessController'); // assuming you have a controller for business logic
const router = express.Router();


dotenv.config();

const app = express();
app.use(express.json());

// Database connection
connectDB();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure views directory path

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration 
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Set a secure secret in your .env file
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

// Serve the registration page
app.get('/register', (req, res) => {
  res.render('register'); // Automatically looks for register.ejs in the views folder
});

// Route to get businesses page
app.get('/businesses', require('./controllers/businessController').getBusinessesPage);

// Protect /home and /dashboard routes
app.get('/home', protect, (req, res) => {
  res.render('home'); // This should match your home.ejs file
});

app.get('/dashboard', protect, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'invest_dashboard.html'));
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
