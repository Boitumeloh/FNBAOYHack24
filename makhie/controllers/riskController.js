const Risk = require('../models/Risk');

// Fetch all risks
const getRisks = async (req, res) => {
    try {
        const risks = await Risk.find();
        res.json(risks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new risk
const createRisk = async (req, res) => {
    const risk = new Risk(req.body);
    try {
        const newRisk = await risk.save();
        res.status(201).json(newRisk);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getRisks, createRisk };
