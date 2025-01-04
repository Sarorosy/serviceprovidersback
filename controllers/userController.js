const User = require('../models/User');
const bcrypt = require('bcryptjs');
const LoginHistory = require('../models/LoginHistory');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');

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
    const users = await User.find({ fld_admin_type: { $ne: "SUPERADMIN" } });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.getActiveServiceProviders = async (req, res) => {
  try {
    const users = await User.find({ fld_admin_type: { $ne: "SUPERADMIN" }, status: "Active" });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.getInActiveServiceProviders = async (req, res) => {
  try {
    const users = await User.find({ fld_admin_type: { $ne: "SUPERADMIN" }, status: "Inactive" });
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
    //const lastUser = await User.findOne().sort({ id: -1 }); 
    //const nextId = lastUser ? lastUser.id + 1 : 150;

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

    //console.log(req.body); 
    //return res.status(200).json({ body: req.body });

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
      fld_admin_type: req.body.fld_admin_type,
      notification_add_access: req.body.notification_add_access,
      notification_edit_access: req.body.notification_edit_access,
      notification_delete_access: req.body.notification_delete_access,
      holiday_add_access: req.body.holiday_add_access,
      holiday_edit_access: req.body.holiday_edit_access,
      holiday_delete_access: req.body.holiday_delete_access,
      location_add_access: req.body.location_add_access,
      location_edit_access: req.body.location_edit_access,
      location_delete_access: req.body.location_delete_access,
      user_add_access: req.body.user_add_access,
      user_edit_access: req.body.user_edit_access,
      user_delete_access: req.body.user_delete_access,
      fld_address: req.body.fld_address,
      fld_gender: req.body.fld_gender,
      fld_designation: req.body.fld_designation,
      fld_aadhar: req.body.fld_aadhar,
      fld_start_date: req.body.fld_start_date,
      fld_end_date: req.body.fld_end_date || "",
      fld_bankname: req.body.fld_bankname,
      fld_accountno: req.body.fld_accountno,
      fld_branch: req.body.fld_branch,
      location: req.body.location,
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

    const emailBody = new FormData();
    // emailBody.append('webname', "Service provider platform");
     emailBody.append('from', "info@thehrbulb.com");
      emailBody.append('to', req.body.fld_email);
      emailBody.append('name',req.body.fld_name);
     emailBody.append('subject', `Account created on Service provider platform`);
     emailBody.append('body', `
       Hi ${req.body.fld_name},<br/><br/>
       Greetings from Service provider platform!<br/><br/>
       Your account has been successfully created. You can login using the following credentials:<br/><br/>
       <strong>URL: </strong>https://elementk.in/service-providers-panel<br/>
       <strong>Email: </strong>${req.body.fld_email}<br/>
       <strong>Password: </strong>${req.body.fld_password}<br/><br/>
       Thanks & Regards,<br/>
       Service provider platform<br/>
     `);
 
     // Send email notification
     await axios.post('https://apacvault.com/sppanelregmail.php', emailBody, {
       headers: emailBody.getHeaders(),
     });

     const emailSP = new FormData();
      emailSP.append('from', "info@thehrbulb.com");
      emailSP.append('to', req.body.fld_email); // Send this email to the service provider's email
      emailSP.append('name', req.body.fld_name);
      emailSP.append('subject', `Update Profile and Bank Details`);
      emailSP.append('body', `
        Hi ${req.body.fld_name},<br/><br/>
        Greetings from Service provider platform!<br/><br/>
        We are excited to have you onboard. To complete your profile, please update your profile documents and bank details.<br/><br/>
        Please follow the link below to update your details:<br/><br/>
        <strong>URL: </strong>https://elementk.in/service-providers-panel/manage-profile<br/><br/>
        Thanks & Regards,<br/>
        Service provider platform<br/>
      `);

      // Send email to the SP for profile and bank details update
      await axios.post('https://apacvault.com/sppanelregmail.php', emailSP, {
        headers: emailSP.getHeaders(),
      });

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
      location: req.body.location || user.location,
      fld_address: req.body.fld_address || user.fld_address,
      fld_gender: req.body.fld_gender || user.fld_gender,
      fld_designation: req.body.fld_designation || user.fld_designation,
      fld_bankname: req.body.fld_bankname || user.fld_bankname,
      fld_accountno: req.body.fld_accountno || user.fld_accountno,
      fld_aadhar: req.body.fld_aadhar || user.fld_aadhar,
      fld_branch: req.body.fld_branch || user.fld_branch,
      fld_admin_type: req.body.fld_admin_type || user.fld_admin_type,
      notification_add_access: req.body.notification_add_access || user.notification_add_access,
      notification_edit_access: req.body.notification_edit_access || user.notification_edit_access,
      notification_delete_access: req.body.notification_delete_access || user.notification_delete_access,
      holiday_add_access: req.body.holiday_add_access || user.holiday_add_access,
      holiday_edit_access: req.body.holiday_edit_access || user.holiday_edit_access,
      holiday_delete_access: req.body.holiday_delete_access || user.holiday_delete_access,
      location_add_access: req.body.location_add_access || user.location_add_access,
      location_edit_access: req.body.location_edit_access || user.location_edit_access,
      location_delete_access: req.body.location_delete_access || user.location_delete_access,
      user_add_access: req.body.user_add_access || user.user_add_access,
      user_edit_access: req.body.user_edit_access || user.user_edit_access,
      user_delete_access: req.body.user_delete_access || user.user_delete_access,
      location: req.body.location || user.location,
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
    updateData.fld_profile_image = (req.body.fld_profile_image === "null" || req.body.fld_profile_image === null)
      ? null
      : req.body.fld_profile_image || user.fld_profile_image;

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
        const newFileName = req.files['fld_aadharcard'][0].filename;
        if (newFileName !== user.fld_aadharcard) { // Check if it's a new file
          updateData.fld_aadharcard = newFileName;
          updateData.aadharaccess = 0; // Set to 0 only if it's new
          updateData.aadharapproved = false;
        }
      }
      if (req.files['fld_pancard']) {
        const newFileName = req.files['fld_pancard'][0].filename;
        if (newFileName !== user.fld_pancard) { // Check if it's a new file
          updateData.fld_pancard = newFileName;
          updateData.pancardaccess = 0; // Set to 0 only if it's new
          updateData.pancardapproved = false;
        }
      }
      if (req.files['fld_cancelledchequeimage']) {
        const newFileName = req.files['fld_cancelledchequeimage'][0].filename;
        if (newFileName !== user.fld_cancelledchequeimage) { // Check if it's a new file
          updateData.fld_cancelledchequeimage = newFileName;
          updateData.chequeaccess = 0; // Set to 0 only if it's new
          updateData.cancelledchequeapproved = false;
        }
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

exports.approveFile = async (req, res) => {
  const { fileType, serviceProviderId } = req.body;

  // Ensure both parameters are provided
  if (!fileType || !serviceProviderId) {
    return res.status(400).json({ error: 'FileType and ServiceProviderId are required' });
  }

  try {
    // Cast serviceProviderId to ObjectId
    const userId = new mongoose.Types.ObjectId(serviceProviderId);

    // Find the user by serviceProviderId (which is the user._id)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check which file type is being approved and update the corresponding field
    switch (fileType) {
      case 'aadhar':
        user.aadharapproved = true; // Mark Aadhar as approved
        break;
      case 'pancard':
        user.pancardapproved = true; // Mark Pancard as approved
        break;
      case 'cancelledcheque':
        user.cancelledchequeapproved = true; // Mark Cancelled Cheque as approved
        break;
      default:
        return res.status(400).json({ error: 'Invalid file type' });
    }

    // Save the user with updated approval status
    await user.save();
    res.status(200).json({ status: true, message: `${fileType} approved successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};
exports.fileRequest = async (req, res) => {
  const { fileType, serviceProviderId, code } = req.body;

  // Ensure both parameters are provided
  if (!fileType || !serviceProviderId || !code) {
    return res.status(400).json({ error: 'FileType and ServiceProviderId and code are required' });
  }

  try {
    // Cast serviceProviderId to ObjectId
    const userId = new mongoose.Types.ObjectId(serviceProviderId);

    // Find the user by serviceProviderId (which is the user._id)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check which file type is being approved and update the corresponding field
    switch (fileType) {
      case 'aadhar':
        user.aadharaccess = code; // Mark Aadhar as approved
        break;
      case 'pancard':
        user.pancardaccess = code; // Mark Pancard as approved
        break;
      case 'cancelledcheque':
        user.chequeaccess = code; // Mark Cancelled Cheque as approved
        break;
      default:
        return res.status(400).json({ error: 'Invalid file type' });
    }

    // Save the user with updated approval status
    await user.save();
    const responseMessage = code == 1
      ? "Request Sent Successfully"
      : code == 2
        ? "Request Approved Successfully"
        : "Invalid Code";

    res.status(200).json({ status: true, message: responseMessage });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

