const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');  // Import auth-related controllers
const { protect } = require('../middleware/authMiddleware'); // Import auth middleware
const User = require('../models/User');

// Route for registering a new user
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

router.get("/logout", logoutUser);

// Protected route to get user balance and transactions (requires authentication)
router.get('/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json({ balance: user.balance, transactions: user.transactions });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Protected route for depositing money (requires authentication)
router.post('/:id/deposit', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const amount = req.body.amount;
            user.balance += amount;
            user.transactions.push({ type: 'deposit', amount });
            await user.save();
            res.json({ balance: user.balance });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Protected route for withdrawing money (requires authentication)
router.post('/:id/withdraw', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const amount = req.body.amount;
            if (amount <= user.balance) {
                user.balance -= amount;
                user.transactions.push({ type: 'withdraw', amount });
                await user.save();
                res.json({ balance: user.balance });
            } else {
                res.status(400).json({ message: 'Insufficient funds' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
