const express = require('express');
const router = express.Router();
const manageWorkoffsController = require('../controllers/manageworkoffsController');

// Get all workoffs
router.get('/', manageWorkoffsController.getAllWorkoffs);

// Get workoff by ID
router.get('/:id', manageWorkoffsController.getWorkoffById);

router.get('/first/:id', manageWorkoffsController.getWorkoffByIdFirstCollection);

// Create a new workoff
router.post('/', manageWorkoffsController.createWorkoff);

// Update a workoff
router.put('/:id', manageWorkoffsController.updateWorkoff);

// Delete a workoff
router.delete('/:id', manageWorkoffsController.deleteWorkoff);

module.exports = router;
