const Project = require('../models/Project');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ id: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProjectById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const project = await Project.findById(id);
  
      if (!project) return res.status(404).json({ message: 'Project not found' });
  
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  exports.getProjectByAdminId = async (req, res) => {
    const { id } = req.params;
  
    try {
      const project = await Project.find({ fld_adminid: id });
  
      if (!project) return res.status(404).json({ message: 'Project not found' });
  
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
// Create a new project
exports.createProject = async (req, res) => {
  const { id, fld_adminid, fld_title, fld_addedon, status } = req.body;
  const newProject = new Project({
    id,
    fld_adminid,
    fld_title,
    fld_addedon,
    status,
  });

  try {
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { fld_adminid, fld_title, fld_addedon, status } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id, // Use id directly since it refers to _id
      { fld_adminid, fld_title, fld_addedon, status },
      { new: true }
    );

    if (!updatedProject) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update project status
exports.updateProjectStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Toggle the status
    project.status = project.status === 'Active' ? 'Inactive' : 'Active';

    const updatedProject = await project.save();

    res.status(200).json({  updatedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
