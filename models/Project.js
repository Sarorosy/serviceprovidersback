const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  fld_adminid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a ServiceProvider model
    required: true
  },
  fld_title: {
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
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
