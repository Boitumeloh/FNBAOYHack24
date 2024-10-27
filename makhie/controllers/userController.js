const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Fetch all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance with the hashed password
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user
    const newUser = await user.save();

    // Return user info and JWT token after registration
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          console.log('User not found'); // Log when user is not found
          return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          console.log('Invalid password'); // Log when password does not match
          return res.status(400).json({ message: "Invalid password" });
      }

      // Store the user ID in the session
      req.session.userId = user._id; // Store user ID in session
      console.log(`User ID stored in session: ${req.session.userId}`);

      // Generate JWT token
      const token = generateToken(user._id);
      console.log('Login successful, token generated:', token); // Log when login is successful and token is generated

      res.json({
          _id: user._id,
          username: user.username,
          email: user.email,
          token: token,
      });
  } catch (error) {
      console.error('Error during login:', error); // Log any unexpected errors
      res.status(500).json({ message: error.message });
  }
};



// Get authenticated user's data
const getUserData = async (req, res) => {
  try {
    // Access the user data attached to req by the auth middleware
    const user = req.user; // This contains user info excluding the password

    // Return only the data you want
    res.json({
      username: user.username,
      email: user.email,
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user data." });
  }
};

// Logout user
const logoutUser = (req, res) => {
  // If only using JWT and localStorage, you can simply inform the client to remove the token
  res.json({ message: 'Successfully logged out', redirectTo: '/' });
};

module.exports = { getUsers, registerUser, loginUser, logoutUser, getUserData };
