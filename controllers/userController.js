const User = require('../models/User');
const bcrypt = require('bcryptjs');
const LoginHistory = require('../models/LoginHistory');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.getServiceProviders = async (req, res) => {
  try {
    const users = await User.find({fld_admin_type : "SERVICE_PROVIDER"});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.getActiveServiceProviders = async (req, res) => {
  try {
    const users = await User.find({fld_admin_type : "SERVICE_PROVIDER", status : "Active"});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.getInActiveServiceProviders = async (req, res) => {
  try {
    const users = await User.find({fld_admin_type : "SERVICE_PROVIDER", status : "Inactive"});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getServiceProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    // Convert the id from string to integer
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'Invalid ID format. ID should be a number.' });
    }

    // Fetch the service provider by the numeric 'id'
    const serviceProvider = await User.findOne({ id: numericId });
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider not found for' + id });
    }
    
    res.status(200).json(serviceProvider);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.getServiceProviderFindById = async (req, res) => {
  try {
    const { id } = req.params;
    

    // Fetch the service provider by the numeric 'id'
    const serviceProvider = await User.findById(id);
    if (!serviceProvider) {
      return res.status(404).json({ message: 'Service provider not found for' + id });
    }
    
    res.status(200).json(serviceProvider);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
// Create a new user
exports.createUser = async (req, res) => {
  try {
    const lastUser = await User.findOne().sort({ id: -1 }); // Sort by id in descending order
    const nextId = lastUser ? lastUser.id + 1 : 150;

    // Access uploaded files and default to null if no files are provided
    let profileImage = req.body.fld_profile_image === "null" || req.body.fld_profile_image === null
      ? null
      : req.body.fld_profile_image || null;

    let aadharCard = req.body.fld_aadharcard === "null" || req.body.fld_aadharcard === null
      ? null
      : req.body.fld_aadharcard || null;

    let panCard = req.body.fld_pancard === "null" || req.body.fld_pancard === null
      ? null
      : req.body.fld_pancard || null;

    let cancelledChequeImage = req.body.fld_cancelledchequeimage === "null" || req.body.fld_cancelledchequeimage === null
      ? null
      : req.body.fld_cancelledchequeimage || null;

    // Check for uploaded files and update file paths if files are present
    if (req.files) {
      if (req.files['fld_profile_image']) {
        profileImage = req.files['fld_profile_image'][0].filename;
      }
      if (req.files['fld_aadharcard']) {
        aadharCard = req.files['fld_aadharcard'][0].filename;
      }
      if (req.files['fld_pancard']) {
        panCard = req.files['fld_pancard'][0].filename;
      }
      if (req.files['fld_cancelledchequeimage']) {
        cancelledChequeImage = req.files['fld_cancelledchequeimage'][0].filename;
      }
    }

    // Ensure password is provided
    if (!req.body.fld_password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(req.body.fld_password, 10);

    // Create user data object
    const userData = {
      fld_adminid: req.body.fld_adminid || 1, // Default to 1 if not provided
      fld_username: req.body.fld_username,
      fld_name: req.body.fld_name,
      fld_email: req.body.fld_email,
      fld_phone: req.body.fld_phone,
      fld_decrypt_password: req.body.fld_password,
      fld_password: hashedPassword, // Store hashed password
      fld_address: req.body.fld_address,
      fld_gender: req.body.fld_gender,
      fld_designation: req.body.fld_designation,
      fld_aadhar: req.body.fld_aadhar,
      fld_start_date: req.body.fld_start_date,
      fld_end_date: req.body.fld_end_date || "",
      fld_bankname: req.body.fld_bankname,
      fld_accountno: req.body.fld_accountno,
      fld_branch: req.body.fld_branch,
      fld_ifsc: req.body.fld_ifsc,
      fld_aadharcard: aadharCard,
      fld_pancard: panCard,
      fld_cancelledchequeimage: cancelledChequeImage,
      fld_profile_image: profileImage,
      fld_addedon: new Date() // Set the current date and time
    };

    // Create and save the new user
    const user = new User(userData);
    await user.save();

    // Return the created user
    res.status(201).json(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ error: 'Bad Request', message: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Prepare update data
    const updateData = {
      fld_username: req.body.fld_username || user.fld_username,
      fld_name: req.body.fld_name || user.fld_name,
      fld_email: req.body.fld_email || user.fld_email,
      fld_phone: req.body.fld_phone || user.fld_phone,
      fld_address: req.body.fld_address || user.fld_address,
      fld_gender: req.body.fld_gender || user.fld_gender,
      fld_designation: req.body.fld_designation || user.fld_designation,
      fld_bankname: req.body.fld_bankname || user.fld_bankname,
      fld_accountno: req.body.fld_accountno || user.fld_accountno,
      fld_branch: req.body.fld_branch || user.fld_branch,
      fld_ifsc: req.body.fld_ifsc || user.fld_ifsc,
      fld_addedon: new Date(), // Update the timestamp
    };

    // Handle nullable fields
    updateData.fld_start_date = (req.body.fld_start_date === "null" || req.body.fld_start_date === null) 
      ? null 
      : req.body.fld_start_date || user.fld_start_date;

    updateData.fld_end_date = (req.body.fld_end_date === "null" || req.body.fld_end_date === null) 
      ? null 
      : req.body.fld_end_date || user.fld_end_date;

    // Handle nullable fields for file uploads
    updateData.fld_aadharcard = (req.body.fld_aadharcard === "null" || req.body.fld_aadharcard === null)
      ? null
      : req.body.fld_aadharcard || user.fld_aadhar;

    updateData.fld_pancard = (req.body.fld_pancard === "null" || req.body.fld_pancard === null)
      ? null
      : req.body.fld_pancard || user.fld_pancard;

    updateData.fld_cancelledchequeimage = (req.body.fld_cancelledchequeimage === "null" || req.body.fld_cancelledchequeimage === null)
      ? null
      : req.body.fld_cancelledchequeimage || user.fld_cancelledchequeimage;

    // Handle file uploads if they are present
    if (req.files) {
      if (req.files['fld_profile_image']) {
        updateData.fld_profile_image = req.files['fld_profile_image'][0].filename;
      }
      if (req.files['fld_aadharcard']) {
        updateData.fld_aadharcard = req.files['fld_aadharcard'][0].filename;
      }
      if (req.files['fld_pancard']) {
        updateData.fld_pancard = req.files['fld_pancard'][0].filename;
      }
      if (req.files['fld_cancelledchequeimage']) {
        updateData.fld_cancelledchequeimage = req.files['fld_cancelledchequeimage'][0].filename;
      }
    }
    if (req.body.fld_decrypt_password) {
      const hashedPassword = await bcrypt.hash(req.body.fld_decrypt_password, 10);
      updateData.fld_password = hashedPassword;
      updateData.fld_decrypt_password = req.body.fld_decrypt_password;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Server Error' });
  }
};


// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Check if the old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.fld_password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    // Hash the new password before saving
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.fld_decrypt_password = newPassword; // or the field where the password is stored
    user.fld_password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Server error' });
  }
};

exports.toggleStatusForUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user login history by ID
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User login history not found' });

    // Toggle the status
    user.status = user.status == 'Active' ? 'Inactive' : 'Active';

    // Save the updated user login history
    await user.save();

    return res.status(200).json({ message: 'User status updated successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
      // Check if user exists
      const user = await User.findOne({ fld_username: username });
      if (!user) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Validate password using bcrypt
      const isMatch = await bcrypt.compare(password, user.fld_password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid username or password' });
      }

      // If successful, return user data (you can also create a JWT token here)
      res.status(200).json({ message: 'Login successful', user });

      const today = new Date();
      const loginDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const startTime = today.toTimeString().split(' ')[0]; // Format: HH:MM:SS
      const addedOn = today; // Full datetime

      // Check for existing login record for today
      const existingLogin = await LoginHistory.findOne({
          fld_user_id: user._id, // Use the user ID from the user document
          fld_login_date: loginDate
      });

      // If no login record found, create a new record
      if (!existingLogin) {
          const newLoginRecord = new LoginHistory({
              fld_user_id: user._id,
              fld_login_date: loginDate,
              fld_start_time: startTime,
              fld_added_on: addedOn
          });

          await newLoginRecord.save(); // Save the new login record
      }
  } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).json({ error: 'Server Error' });
  }
};

// Logout user and update login history
exports.logoutUser = async (req, res) => {
  const userId = req.user.id; // Assuming you're using some middleware to get the authenticated user's ID

  try {
      const today = new Date();
      const loginDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const endTime = today.toTimeString().split(' ')[0]; // Format: HH:MM:SS

      // Find the login history record for today
      const loginRecord = await LoginHistory.findOne({
          fld_user_id: userId,
          fld_login_date: loginDate
      });

      if (!loginRecord) {
          return res.status(404).json({ message: 'No login record found for today' });
      }

      // Update the end time
      loginRecord.fld_end_time = endTime;
      await loginRecord.save();

      res.status(200).json({ message: 'Logout successful', loginRecord });
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Server Error' });
  }
};

// Update all users' fld_password to bcrypt hash of fld_decrypt_password
exports.updateAllPasswords = async (req, res) => {
  try {
      const users = await User.find(); // Get all users

      for (const user of users) {
          // Hash fld_decrypt_password
          const hashedPassword = await bcrypt.hash(user.fld_decrypt_password, 10);
          // Update fld_password
          user.fld_password = hashedPassword;
          await user.save(); // Save the updated user
      }

      res.status(200).json({ message: 'All passwords updated successfully.' });
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Server Error' });
  }
};

