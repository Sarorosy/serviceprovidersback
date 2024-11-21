// models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  addedon: {
    type: Date,
    default: Date.now,
  },
});

const Location = mongoose.model('Location', LocationSchema);

module.exports = Location;
