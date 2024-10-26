const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  fld_user_id: {
    type: mongoose.Schema.Types.ObjectId, // Array of ObjectIds for multiple users
    ref: 'User', // Referencing the 'users' collection
    required: true,
  },
  fld_login_date: {
    type: Date,
    required: true,
  },
  fld_start_time: {
    type: String, // Use String or Date based on your requirement
    required: true,
  },
  fld_end_time: {
    type: String, // Use String or Date based on your requirement
    default: null,
  },
  fld_added_on: {
    type: Date,
    default: Date.now,
  },
  fld_updated_on: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
