const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fld_adminid: {
    type: Number,
    default: 1,
  },
  fld_admin_type: {
    type: String,
    enum: ['SUPERADMIN', 'SERVICE_PROVIDER'],
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
  fld_profile_image: String,
  fld_phone: String,
  fld_gender: {
    type: String,
    enum: ['Male', 'Female'],
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
  fld_start_date: {
    type: Date,
    default: null, // Optional: explicitly allow null
  },
  fld_end_date: {
    type: Date,
    default: null, // Optional: explicitly allow null
  },
  fld_total_work_offs: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
