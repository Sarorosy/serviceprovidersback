const express = require('express');
const {
  createWorksummary,
  getWorksummaries,
  getWorksummary,
  editWorksummary,
  deleteWorksummary,
  getWorksummaryByAdminId,
  toggleWorksummaryStatus
} = require('../controllers/worksummaryController.js');

const router = express.Router();

// Create a new work summary
router.post('/', createWorksummary);

// Get all work summaries
router.get('/', getWorksummaries);

// Get a specific work summary by ID
router.get('/:id', getWorksummary);
router.get('/user/:id', getWorksummaryByAdminId);

router.patch('/:id/status',toggleWorksummaryStatus )
// Edit a work summary
router.put('/:id', editWorksummary);

// Delete a work summary
router.delete('/:id', deleteWorksummary);

module.exports = router;
