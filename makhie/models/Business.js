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
    risk_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Risk' 
    },
    location_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Location' 
    },
    funding_received: { 
        type: Number, 
        required: true, 
        default: 0 // Default funding received is set to 0
    },
    image: { 
        type: String, 
        required: false // Optional field for business image
    },
    description: { 
        type: String, 
        required: false // Optional field for business description
    }
}, { timestamps: true });

// Calculate funded percentage
businessSchema.virtual('fundedPercentage').get(function () {
    return Math.round((this.funding_received / this.funding_goal) * 100) || 0;
});

module.exports = mongoose.model('Business', businessSchema);

