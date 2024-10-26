const Holiday = require('../models/Holiday.js');

// Create a new holiday
exports.createHoliday = async (req, res) => {
    const { fld_adminid, fld_userid, fld_title, fld_holiday_date } = req.body;
  
    try {
      const lastHoliday = await Holiday.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1);
      const newId = lastHoliday ? lastHoliday.id + 1 : 1;
  
      const holiday = new Holiday({
        id: newId, // Make sure to include the id field here
        fld_adminid,
        fld_userid,
        fld_title,
        fld_holiday_date,
      });
  
      await holiday.save();
      return res.status(201).json({ message: 'Holiday created successfully', holiday });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating holiday', error: error.message });
    }
  };
  

// Get all holidays
exports.getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    return res.status(200).json(holidays);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching holidays', error: error.message });
  }
};

// Get a specific holiday
exports.getHoliday = async (req, res) => {
  const { id } = req.params;

  try {
    const holiday = await Holiday.findById(id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });
    return res.status(200).json(holiday);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching holiday', error: error.message });
  }
};

// Edit a holiday
exports.editHoliday = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const holiday = await Holiday.findByIdAndUpdate(id, updates, { new: true });
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });
    return res.status(200).json({ message: 'Holiday updated successfully', holiday });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating holiday', error: error.message });
  }
};
// Get holidays by user ID (upcoming holidays)
exports.getHolidaysByUserid = async (req, res) => {
  const { id } = req.params; // assuming 'id' is the user ID

  try {
    // Get the current date
    const currentDate = new Date();

    // Find holidays where the fld_holiday_date is greater than the current date
    const holidays = await Holiday.find({
      fld_userid: { $in: [id] },
      fld_holiday_date: { $gt: currentDate }, // Upcoming holidays only
    })
      .populate('fld_adminid')
      .populate('fld_userid');
    
    if (!holidays || holidays.length === 0) {
      return res.status(404).json({ message: 'No upcoming holidays found for this user' });
    }

    return res.status(200).json(holidays);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching holidays', error: error.message });
  }
};

// Delete a holiday
exports.deleteHoliday = async (req, res) => {
  const { id } = req.params;

  try {
    const holiday = await Holiday.findByIdAndDelete(id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });
    return res.status(200).json({ message: 'Holiday deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting holiday', error: error.message });
  }
};
