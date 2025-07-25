const mongoose = require('mongoose');

const Location = require('./Location');

const userSchema = new mongoose.Schema({
  fld_adminid: {
    type: Number,
    default: 1,
  },
  fld_admin_type: {
    type: String,
    enum: ['SUPERADMIN', 'SERVICE_PROVIDER', 'SUBADMIN'], // Added SUBADMIN role
    default: 'SERVICE_PROVIDER',
  },
  fld_username: {
    type: String,
    required: true,
  },
  fld_password: {
    type: String,
    required: true,
  },
  fld_decrypt_password: String,
  fld_name: {
    type: String,
    required: true,
  },
  fld_email: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location', // The name of the Location model
  },
  fld_profile_image: String,
  fld_phone: String,
  fld_gender: {
    type: String,
    default: null
  },
  fld_marital: {
    type: String,
  },
  fld_address: String,
  fld_designation: String,
  fld_aadhar: String,
  fld_bankname: String,
  fld_accountno: String,
  fld_branch: String,
  fld_ifsc: String,
  fld_verify: String,
  fld_last_login: {
    type: Date,
    default: Date.now,
  },
  fld_addedon: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  fld_aadharcard: String,
  fld_pancard: String,
  fld_cancelledchequeimage: String,
   // New fields for approval status
   aadharapproved: {
    type: Boolean,
    default: false,
  },
  pancardapproved: {
    type: Boolean,
    default: false,
  },
  cancelledchequeapproved: {
    type: Boolean,
    default: true,
  },
  aadharaccess: {
    type: Number,
    default: 0,
  },
  pancardaccess: {
    type: Number,
    default: 0,
  },
  chequeaccess: {
    type: Number,
    default: 0,
  },
  fld_start_date: {
    type: Date,
    default: null, // Optional: explicitly allow null
  },
  fld_end_date: {
    type: Date,
    default: null, // Optional: explicitly allow null
  },
  fld_total_work_offs: String,

  // Access control fields for SUBADMIN
  notification_add_access: {
    type: Boolean,
    default: false,
  },
  notification_edit_access: {
    type: Boolean,
    default: false,
  },
  notification_delete_access: {
    type: Boolean,
    default: false,
  },

  holiday_add_access: {
    type: Boolean,
    default: false,
  },
  holiday_edit_access: {
    type: Boolean,
    default: false,
  },
  holiday_delete_access: {
    type: Boolean,
    default: false,
  },

  location_add_access: {
    type: Boolean,
    default: false,
  },
  location_edit_access: {
    type: Boolean,
    default: false,
  },
  location_delete_access: {
    type: Boolean,
    default: false,
  },

  user_add_access: {
    type: Boolean,
    default: false,
  },
  user_edit_access: {
    type: Boolean,
    default: false,
  },
  user_delete_access: {
    type: Boolean,
    default: false,
  },
  web_code: {
    type: String,
    default: null,
  },
  web_code_date: {
    type: Date,
    default: null,
  },
  quit_services: {
    type: Boolean,
    default: false,
  }
  
  
});

const User = mongoose.model('User', userSchema);
module.exports = User;
