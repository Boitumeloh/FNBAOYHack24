const express = require('express');
const router = express.Router();
const Business = require('../models/Business');

// Get all businesses
router.get('/', async (req, res) => {
    try {
        const businesses = await Business.find().populate('risk_id location_id');
        res.json(businesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new business
router.post('/', async (req, res) => {
    const business = new Business({
        business_name: req.body.business_name,
        industry: req.body.industry,
        funding_goal: req.body.funding_goal,
        benefit: req.body.benefit,
        time_span: req.body.time_span,
        risk_id: req.body.risk_id,
        location_id: req.body.location_id
    });

    try {
        const newBusiness = await business.save();
        res.status(201).json(newBusiness);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
