const mongoose = require('mongoose');

const ManageWorkoffSchema = new mongoose.Schema({
    fld_adminid: {
        type: mongoose.Schema.Types.ObjectId, // Set as ObjectId to reference 'users' collection
        ref: 'User', // Reference to the 'users' collection
        required: true,
    },
    fld_workoffs_startdate: {
        type: Date,
        required: true,
    },
    fld_workoffs_enddate: {
        type: Date,
        required: true,
    },
    fld_total_no_of_work_offs: {
        type: String,
        required: true,
    },
    fld_work_offs_availed: {
        type: String,
        required: true,
    },
    fld_work_offs_balance: {
        type: String,
        required: true,
    },
    fld_addedon: {
        type: Date,
        default: Date.now,
    },
    fld_updated_at: {
        type: Date,
        default: Date.now,
    },
    fld_from_to_dates: {
        type: [String], // Store as an array of strings
    },
});

const ManageWorkoff = mongoose.model('ManageWorkoff', ManageWorkoffSchema);

module.exports = ManageWorkoff;
