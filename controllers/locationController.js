// controllers/locationController.js
const Location = require('../models/Location');

// Create a new location
exports.createLocation = async (req, res) => {
  const { name } = req.body;
  
  const newLocation = new Location({
    name,
  });

  try {
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({ addedon: -1 });
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a location by ID
exports.getLocationById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const location = await Location.findById(id);
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateLocation = async (req, res) => {
    const locationId = req.params.id;  // Get location ID from request parameters
    const updatedData = req.body;      // Get the updated data from the request body

    try {
        // Find and update the location by ID
        const updatedLocation = await Location.findByIdAndUpdate(locationId, updatedData, { new: true });

        if (!updatedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }

        // Return the updated location data
        res.status(200).json(updatedLocation);
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a location
exports.deleteLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLocation = await Location.findByIdAndDelete(id);

    if (!deletedLocation) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
