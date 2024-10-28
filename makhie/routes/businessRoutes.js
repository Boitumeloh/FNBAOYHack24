const express = require('express');
const router = express.Router();
const multer = require('multer');
const Business = require('../models/Business');

// Configure multer to store the file in memory
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

// Get all businesses and render the business page
router.get('/businesses', async (req, res) => {
    try {
        const businesses = await Business.find().populate('risk_id location_id');
        res.render('businesspage', { businesses }); // Render the EJS page and pass the data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Add a new business
router.post('/', upload.single('image'), async (req, res) => {
    const business = new Business({
        business_name: req.body.business_name,
        industry: req.body.industry,
        funding_goal: req.body.funding_goal,
        benefit: req.body.benefit,
        time_span: req.body.time_span,
        location: req.body.location,
        image: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        },
        description: req.body.description,
        user_id: req.body.user_id
    });

    try {
        const newBusiness = await business.save();
        res.status(201).json(newBusiness);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;

