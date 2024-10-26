const mongoose = require('mongoose');

const ServicechargeSchema = new mongoose.Schema({
    fld_service_provider_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a ServiceProvider model
        required: true
    },
    fld_from_date: {
        type: Date,
        required: true
    },
    fld_to_date: {
        type: Date,
        required: true
    },
    fld_service_charge: {
        type: Number,
        required: true
    },
    fld_added_on: {
        type: Date,
        default: Date.now
    },
    fld_updated_on: {
        type: Date,
        default: Date.now
    },
    fld_from_to_dates: {
        type: [String], 
        required: true
    }
});

module.exports = mongoose.model('Servicecharge', ServicechargeSchema);
