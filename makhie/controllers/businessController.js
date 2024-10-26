const Business = require('../models/Business');

// Fetch all businesses and render the businesses page
const getBusinessesPage = async (req, res) => {
    try {
        const businesses = await Business.find(); // Fetch all businesses from the database
        res.render('businesspage', { businesses }); // Render the EJS template with businesses data
    } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).send('Server Error');
    }
};

// Fetch all businesses (as JSON)
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

const registerBusiness = async (req, res) => {
    try {
        const { business_name, industry, funding_goal, benefit, time_span, location_id } = req.body;
        
        // Create new business document
        const newBusiness = new Business({
            business_name,
            industry,
            funding_goal,
            benefit,
            time_span,
            location_id,
            funding_received: 0, // default value for funding received
        });

        await newBusiness.save();
        res.status(201).json({ message: 'Business registered successfully', business: newBusiness });
    } catch (error) {
        res.status(500).json({ message: 'Error registering business', error: error.message });
    }
};

module.exports = { getBusinesses, createBusiness, getBusinessesPage, registerBusiness }; // Export the new function

