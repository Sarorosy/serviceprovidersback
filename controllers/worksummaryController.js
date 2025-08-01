const Worksummary = require('../models/Worksummary.js');
const LoginHistory = require('../models/LoginHistory');
const User = require('../models/User.js');
const axios = require("axios");


// Create a new work summary
exports.createWorksummary = async (req, res) => {
  const { fld_adminid, fld_projectid, fld_upload_files, fld_description } = req.body;

  try {
    const lastWorksummary = await Worksummary.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
    const newId = lastWorksummary ? lastWorksummary.id + 1 : 1;

    const worksummary = new Worksummary({
      id: newId,
      fld_adminid,
      fld_projectid,
      fld_upload_files,
      fld_description,
      fld_addedon: new Date(),
      status: 'Active',
    });

    await worksummary.save();

    const today = new Date();
    const loginDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const endTime = today.toTimeString().split(' ')[0];  // Format: HH:MM:SS

    const loginRecord = await LoginHistory.findOne({
      fld_user_id: fld_adminid,
      fld_login_date: loginDate
    });

    if (!loginRecord) {
      return res.status(404).json({ message: 'No login record found for today' });
    }

    loginRecord.fld_end_time = endTime;
    await loginRecord.save();

    const day = today.getDay(); // 0 = Sunday, 6 = Saturday
    const hours = today.getHours();
    const minutes = today.getMinutes();

    let shouldCallAxios = false;

    if (day >= 1 && day <= 5) {
      if (hours < 17 || (hours === 17 && minutes < 30)) {
        shouldCallAxios = true;
      }
    } else if (day === 6) {
      if (hours < 14) {
        shouldCallAxios = true;
      }
    }

    const user = await User.findById(fld_adminid);

    if (shouldCallAxios && user && user.fld_email) {
      try {
        await axios.post('https://webexback-06cc.onrender.com/api/users/autosendleftmessage', {
          email: user.fld_email
        });
      } catch (axiosErr) {
        console.error('Axios error (autosendleftmessage):', axiosErr.message);
        // Optional: log this error to DB or continue silently
      }
    }

    if (user && user.fld_email) {
      try {
        const res = await axios.post('https://rapidcollaborate.com/call_calendar/cronjobs/markAsAbsent', {
          email: user.fld_email
        });
        console.log(res)
      } catch (axiosErr) {
        console.error('Axios error (markAsAbsent):', axiosErr.message);
        // Optional: log this error to DB or continue silently
      }
    }

    return res.status(201).json({ message: 'Work summary created successfully', worksummary });
  } catch (error) {
    console.error('Main Error:', error);
    return res.status(500).json({ message: 'Error creating work summary', error: error.message });
  }
};

// Get all work summaries
exports.getWorksummaries = async (req, res) => {
  try {
    const worksummaries = await Worksummary.find();
    return res.status(200).json(worksummaries);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching work summaries', error: error.message });
  }
};

// Get a specific work summary
exports.getWorksummary = async (req, res) => {
  const { id } = req.params;

  try {
    const worksummary = await Worksummary.findById(id);
    if (!worksummary) return res.status(404).json({ message: 'Work summary not found' });
    return res.status(200).json(worksummary);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching work summary', error: error.message });
  }
};

// Get a specific work summary
exports.getWorksummaryByAdminId = async (req, res) => {
  const { id } = req.params;

  try {
    const worksummary = await Worksummary.find({ fld_adminid: id });
    if (!worksummary) return res.status(404).json({ message: 'Work summary not found' });
    return res.status(200).json(worksummary);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching work summary', error: error.message });
  }
};


// Edit a work summary
exports.editWorksummary = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const worksummary = await Worksummary.findByIdAndUpdate(id, updates, { new: true });
    if (!worksummary) return res.status(404).json({ message: 'Work summary not found' });
    return res.status(200).json({ message: 'Work summary updated successfully', worksummary });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating work summary', error: error.message });
  }
};

exports.toggleWorksummaryStatus = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the work summary by ID
    const worksummary = await Worksummary.findById(id);
    if (!worksummary) return res.status(404).json({ message: 'Work summary not found' });

    // Toggle the status
    worksummary.status = worksummary.status === 'Active' ? 'Inactive' : 'Active';

    // Save the updated work summary
    await worksummary.save();

    return res.status(200).json({ message: 'Work summary status updated successfully', worksummary });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating work summary status', error: error.message });
  }
};

// Delete a work summary
exports.deleteWorksummary = async (req, res) => {
  const { id } = req.params;

  try {
    const worksummary = await Worksummary.findByIdAndDelete(id);
    if (!worksummary) return res.status(404).json({ message: 'Work summary not found' });
    return res.status(200).json({ message: 'Work summary deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting work summary', error: error.message });
  }
};
