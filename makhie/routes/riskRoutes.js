const express = require('express');
const router = express.Router();
const Risk = require('../models/Risk');

// Get all risk levels
router.get('/', async (req, res) => {
    try {
        const risks = await Risk.find();
        res.json(risks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
