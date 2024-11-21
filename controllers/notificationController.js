// src/controllers/notificationController.js
const Notification = require('../models/Notification.js');

// Create a new notification
exports.createNotification = async (req, res) => {
  const { fld_adminid, location, isForAll, fld_title, fld_description, fld_upload_file, fld_due_date } = req.body;

  try {
    const notification = new Notification({
      fld_adminid,
      location,
      isforall:isForAll,
      fld_title,
      fld_description,
      fld_upload_file,
      fld_due_date,
    });

    await notification.save();
    return res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

// Get all notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('fld_adminid').populate('location');
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};
// Get specific notifications
exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
    .populate('fld_adminid')
    .populate('location');
    return res.status(200).json(notification);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Edit a notification
exports.editNotification = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const notification = await Notification.findByIdAndUpdate(id, updates, { new: true });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    return res.status(200).json({ message: 'Notification updated successfully', notification });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// Get notifications by user ID
exports.getNotificationByUserid = async (req, res) => {
  const { id } = req.params; // assuming 'id' is the user ID

  try {
    const notifications = await Notification.find({ location: { $in: [id] } })
      .populate('fld_adminid')
      .populate('location');
    
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for this user' });
    }

    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findByIdAndDelete(id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};
