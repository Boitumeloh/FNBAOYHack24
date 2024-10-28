const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const { protect } = require('./middleware/authMiddleware'); // Import the protect middleware
const mongoose = require('mongoose');
const session = require('express-session');
const Business = require('./models/Business');
const businessController = require('./controllers/businessController');
//const { processPayment } = require('./controllers/paymentController');
const router = express.Router();
const User = require('./models/User');
const crypto = require('crypto');
const querystring = require('querystring');


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
app.use('/payment', require('./routes/paymentRoutes'));


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

// Route to render the about page for a specific business
app.get('/about/:businessId', async (req, res) => {
  try {
    const businessId = req.params.businessId; // Get the business ID from the route parameters
    const business = await Business.findById(businessId); // Query the database for the business

    if (!business) {
      return res.status(404).send('Business not found'); // Handle case where business does not exist
    }

    res.render('about', { business }); // Render the about page with the business data
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error'); // Handle server error
  }
});

// Render contribute page
app.post('/contribute', async (req, res) => {
  try {
    const businessId = req.body.businessId;
    if (!businessId) {
      return res.status(400).json({ message: 'Business ID is required' });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Render the amount page with the specific business data
    res.render('amount', { business });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


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

// Route to handle payment processing
app.post('/pay', (req, res) => {
  const { amount, businessId } = req.body; // Get amount and business ID from the request body

  const extractNum = (str) => {
    return str.replace(/[^0-9]/g, '');
  }

  const businessIdNum = extractNum(businessId);

  // Ensure that businessId is a number
  const businessIdNumber = parseInt(businessIdNum, 10);

  // Check if businessId is a valid number
  if (isNaN(businessIdNumber)) {
    return res.status(400).send('Invalid business ID');
  }

  // PayFast parameters
  const payfastParams = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY,
    amount: parseFloat(amount), // Ensure amount is a float
    item_name: 'Contribution to Business on Makhie', // A description of what the payment is for
    return_url: process.env.PAYFAST_RETURN_URL, // URL to redirect to on success
    cancel_url: process.env.PAYFAST_CANCEL_URL, // URL to redirect to on cancel
    notify_url: process.env.PAYFAST_NOTIFY_URL, // URL to notify on payment confirmation
    custom_int1: businessIdNumber // You can add any custom parameters if necessary
  };

  console.log(payfastParams.custom_int1);

  // Generate the query string for PayFast
  const queryString = querystring.stringify(payfastParams);
  const payfastUrl = `${process.env.PAYFAST_PAYMENT_URL}?${queryString}`; // PayFast payment URL

  // Redirect user to the PayFast payment page
  res.redirect(payfastUrl);
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
