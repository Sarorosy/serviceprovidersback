const express = require('express');
const {
  createHoliday,
  getHolidays,
  getHoliday,
  editHoliday,
  deleteHoliday,
  getHolidaysByUserid,
} = require('../controllers/holidayController.js');

const router = express.Router();

// Create a holiday
router.post('/', createHoliday);

// Get all holidays
router.get('/', getHolidays);

// Get a specific holiday by ID
router.get('/:id', getHoliday);

router.get('/user/:id', getHolidaysByUserid);

// Edit a holiday
router.put('/:id', editHoliday);

// Delete a holiday
router.delete('/:id', deleteHoliday);

module.exports = router;
