const Business = require('../models/Business');

// Fetch all businesses
const getBusinesses = async (req, res) => {
    try {
        const businesses = await Business.find();
        res.json(businesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new business
const createBusiness = async (req, res) => {
    const business = new Business(req.body);
    try {
        const newBusiness = await business.save();
        res.status(201).json(newBusiness);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getBusinesses, createBusiness };
