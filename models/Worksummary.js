const mongoose = require('mongoose');

const WorksummarySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  fld_adminid: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Users._id
    ref: 'Users', // Referencing the Users model
    required: true,
  },
  fld_projectid: {
    type: mongoose.Schema.Types.ObjectId, // Reference to Users._id
    ref: 'Projects', // Referencing the Users model
    required: true,
  },
  fld_upload_files: {
    type: String, // Path to the uploaded file (image, document, etc.)
    required: false,
  },
  fld_description: {
    type: String, // Description of the work summary
    required: true,
  },
  fld_addedon: {
    type: Date, // Date the work summary was added
    default: Date.now,
  },
  status: {
    type: String, // Status of the work summary
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
});

// Create the model
const Worksummary = mongoose.model('Worksummary', WorksummarySchema);

module.exports = Worksummary;
