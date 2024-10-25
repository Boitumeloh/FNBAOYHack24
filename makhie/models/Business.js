const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    business_name: { 
      type: String,
      required: true 
    },

    industry: { 
      type: String,
      required: true 
    },

    funding_goal: { 
      type: Number,
      required: true 
    },

    benefit: { 
      type: String,
      required: true 
    },

    time_span: { 
      type: String,
      required: true 
    },
    risk_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Risk' },
    location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
