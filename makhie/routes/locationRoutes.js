const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Get all locations
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
