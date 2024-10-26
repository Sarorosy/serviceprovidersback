const express = require('express');
const router = express.Router();
const workoffsController = require('../controllers/workoffsController');

// Get all workoffs
router.get('/', workoffsController.getAllWorkoffs);

// Get workoff by ID
router.get('/:id', workoffsController.getWorkoffById);

// Get workoff by ID
router.get('/user/:id', workoffsController.getWorkoffsByAdminId);

// Create a new workoff
router.post('/', workoffsController.createWorkoff);

// Update a workoff
router.put('/:id', workoffsController.updateWorkoff);

// Delete a workoff
router.delete('/:id', workoffsController.deleteWorkoff);

module.exports = router;
