const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema({
  risk_level: {
    type: String,
    required: true,
  },
  risk_description: {
    type: String,
    required: true,
  },
});

const Risk = mongoose.model('Risk', riskSchema);
module.exports = Risk;
