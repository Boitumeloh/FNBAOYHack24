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
    location: { 
        type: String, 
        required: true 
    },
    funding_received: { 
        type: Number, 
        required: true, 
        default: 0 // Default funding received is set to 0
    },
    image: {
        data: Buffer, // Binary data for image
        contentType: String // MIME type, e.g., 'image/png'
    },
    description: { 
        type: String, 
        required: true
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }
}, { timestamps: true });

// Calculate funded percentage
businessSchema.virtual('fundedPercentage').get(function () {
    return Math.round((this.funding_received / this.funding_goal) * 100) || 0;
});

module.exports = mongoose.model('Business', businessSchema);

