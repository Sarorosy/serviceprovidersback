const mongoose = require('mongoose');

const EndServiceSchema = new mongoose.Schema({
    sp_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    proposed_end_date: {
        type: Date
    },
    comments: {
        type: String
    },
    admin_comments: {
        type: String,
    },
    request_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    admin_comments: {
        type: String
    }
});

module.exports = mongoose.model('EndService', EndServiceSchema);
