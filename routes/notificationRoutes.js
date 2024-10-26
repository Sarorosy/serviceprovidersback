const express = require('express');
const {
  createNotification,
  getNotifications,
  getNotification,
  editNotification,
  deleteNotification,
  getNotificationByUserid
} = require('../controllers/notificationController.js');

const router = express.Router();

// Create a notification
router.post('/', createNotification);

// Get all notifications
router.get('/', getNotifications);

router.get('/:id', getNotification);
router.get('/user/:id', getNotificationByUserid);
// Edit a notification
router.put('/:id', editNotification);

// Delete a notification
router.delete('/:id', deleteNotification);

module.exports = router;
