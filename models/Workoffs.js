const mongoose = require('mongoose');

const WorkoffSchema = new mongoose.Schema({
    id: {
        type: Number,
       // unique: true, // Ensure this is unique
    },
    fld_adminid: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Users._id
        ref: 'Users', // Referencing the Users model
        required: true,
    },
    fld_start_date: {
        type: Date,
        required: true,
    },
    fld_end_date: {
        type: Date,
        required: true,
    },
    fld_duration: {
        type: Number,
        required: true,
    },
    fld_reason: {
        type: String,
        required: true,
    },
    fld_addedon: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    fld_work_off_added_by: {
        type: String,
        required: true,
    },
    fld_work_offs_start_date_half: {
        type: Date,
    },
    fld_work_offs_end_date_half: {
        type: Date,
    },
    fld_leave_type: {
        type: String,
        required: true,
    },
    fld_month: {
        type: Number,
    },
    fld_year: {
        type: Number,
    },
});

WorkoffSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastWorkoff = await Workoff.findOne().sort({ id: -1 });
        this.id = (lastWorkoff ? lastWorkoff.id : 0) + 1; // Increment ID
    }
    next();
});

const Workoff = mongoose.model('Workoff', WorkoffSchema);


module.exports = Workoff;
