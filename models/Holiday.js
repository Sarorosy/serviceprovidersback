const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HolidaySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    fld_adminid: {
        type: Number, // Admin ID as a Number
        required: true,
    },
    fld_userid: [{
        type: Schema.Types.ObjectId, // Array of ObjectIds for multiple users
        ref: 'User', // Referencing the 'users' collection
        required: true,
    }],
    fld_title: {
        type: String, // Title of the holiday
        required: true,
    },
    fld_holiday_date: {
        type: Date, // Date of the holiday
        required: true,
    },
    fld_addedon: {
        type: Date, // Date when the holiday was added
        default: Date.now,
    },
    status: {
        type: String, // Status of the holiday (Active/Inactive)
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
});

// Create the model
const Holiday = mongoose.model('Holiday', HolidaySchema);

module.exports = Holiday;
