const LoginHistory = require('../models/LoginHistory');

// Create a new login history entry
exports.createLoginHistory = async (req, res) => {
  try {
    const { fld_user_id, fld_login_date, fld_start_time, fld_end_time } = req.body;

    const newLoginHistory = new LoginHistory({
      fld_user_id,
      fld_login_date,
      fld_start_time,
      fld_end_time,
    });

    await newLoginHistory.save();
    res.status(201).json({ message: 'Login history created successfully', data: newLoginHistory });
  } catch (error) {
    res.status(500).json({ message: 'Error creating login history', error });
  }
};

// Get all login history entries
exports.getAllLoginHistory = async (req, res) => {
  try {
    const loginHistory = await LoginHistory.find().populate('fld_user_id', 'username'); // Populate with user data if needed
    res.status(200).json(loginHistory);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving login history', error });
  }
};

exports.getAllLoginHistoryById = async (req, res) => {
    try {
        const id = req.params.id; // Assuming the user ID is passed in the request parameters
        const loginHistory = await LoginHistory.find({ fld_user_id: id });
        
        if (!loginHistory.length) {
            return res.status(404).json({ message: 'No login history found for this user' });
        }
        
        res.status(200).json(loginHistory);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving login history', error });
    }
};


// Update a login history entry
exports.updateLoginHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedLoginHistory = await LoginHistory.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Login history updated successfully', data: updatedLoginHistory });
  } catch (error) {
    res.status(500).json({ message: 'Error updating login history', error });
  }
};

// Delete a login history entry
exports.deleteLoginHistory = async (req, res) => {
  const { id } = req.params;
  try {
    await LoginHistory.findByIdAndDelete(id);
    res.status(200).json({ message: 'Login history deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting login history', error });
  }
};
