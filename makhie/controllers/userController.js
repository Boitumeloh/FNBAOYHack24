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

    // Hash the password once and log it to confirm consistency
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed password during registration:", hashedPassword);

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

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log the stored hashed password and compare it
    console.log("Stored hashed password in database:", user.password);
    console.log("Plain password provided at login:", password);

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match: ", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Return user info and JWT token for login
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = (req, res) => {
  // Respond to the client to handle token removal
  res.json({ message: 'Successfully logged out', redirectTo: '/' });
};

module.exports = { getUsers, registerUser, loginUser, logoutUser };
