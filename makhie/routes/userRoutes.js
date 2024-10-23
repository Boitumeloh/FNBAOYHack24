const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user balance and transactions
router.get('/:id', async (req, res) => {
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

// Deposit money
router.post('/:id/deposit', async (req, res) => {
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

// Withdraw money
router.post('/:id/withdraw', async (req, res) => {
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
