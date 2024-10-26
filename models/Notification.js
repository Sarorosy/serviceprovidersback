const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  fld_adminid: {
    type: Number, // Use Number for admin ID
    required: true,
  },
  fld_userid: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Refers to the User model (or ServiceProvider model)
    required: true
  }],  
  fld_title: {
    type: String,
    required: true,
  },
  fld_description: {
    type: String,
    required: true,
  },
  fld_upload_file: {
    type: String,
    required: false, // Make this optional if a file is not always uploaded
  },
  fld_due_date: {
    type: Date,
    required: true,
  },
  fld_addedon: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'], // You can modify this as needed
    default: 'Active',
  },
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports =  Notification;
