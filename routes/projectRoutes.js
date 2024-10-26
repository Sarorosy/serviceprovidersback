const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Get all projects
router.get('/', projectController.getAllProjects);

router.get('/:id', projectController.getProjectById);
router.get('/user/:id', projectController.getProjectByAdminId);
// Create a new project
router.post('/', projectController.createProject);

// Update a project
router.put('/:id', projectController.updateProject);
router.patch('/:id/status', projectController.updateProjectStatus);
// Delete a project
router.delete('/:id', projectController.deleteProject);

module.exports = router;
