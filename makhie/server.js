const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

const app = express();
app.use(express.json());

// Database connection
connectDB();

// Serve static files from the 'client' directory
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/businesses', require('./routes/businessRoutes'));
app.use('/api/locations', require('./routes/locationRoutes'));
app.use('/api/risks', require('./routes/riskRoutes'));


// Serve the index.html file for the default route ('/')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'index.html'));
});

app.post('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'index.html'));
});

// Serve the businesses page for the '/login' route
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'register.html'));
});

// Serve the businesses page for the '/businesses' route
app.get('/businesses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'businesspage.html'));
});

// Serve the businesses page for the '/:id/dashboard' route
app.get('/:id/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'invest_dashboard.html'));
});

// Serve the businesses page for the '/:id/dashboard' route
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'invest_dashboard.html'));
});

// Serve the businesses page for the '/login' route
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'login.html'));
});

app.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'home.html'));
});

// Serve the businesses page for the '/login' route
app.get('/invest', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views', 'invest.html'));
});

// Catch-All for Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
