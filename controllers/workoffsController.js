const Workoff = require('../models/Workoffs');
const ManageWorkoff = require('../models/ManageWorkoff');
// Get all workoffs
exports.getAllWorkoffs = async (req, res) => {
    try {
        const workoffs = await Workoff.find().sort({ id: -1 });
        res.status(200).json(workoffs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get workoff by ID
exports.getWorkoffById = async (req, res) => {
    const { id } = req.params;

    try {
        const workoff = await Workoff.findOne({ id: id });

        if (!workoff) return res.status(404).json({ message: 'Workoff not found' });

        res.status(200).json(workoff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getWorkoffsByAdminId = async (req, res) => {
    const { id } = req.params;

    try {
        const workoffs = await Workoff.find({ fld_adminid: id });

        if (!workoffs.length) return res.status(404).json({ message: 'No workoffs found for this admin' });

        res.status(200).json(workoffs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new workoff

exports.createWorkoff = async (req, res) => {
    const { 
        fld_adminid, 
        fld_start_date, 
        fld_end_date, 
        fld_duration, 
        fld_reason, 
        fld_addedon, 
        status, 
        fld_work_off_added_by, 
        fld_work_offs_start_date_half, 
        fld_work_offs_end_date_half,  
        fld_month, 
        fld_year 
    } = req.body;

    
    // Create new workoff record
    const newWorkoff = new Workoff({
        fld_adminid,
        fld_start_date,
        fld_end_date,
        fld_duration,
        fld_reason,
        fld_addedon,
        status,
        fld_work_off_added_by,
        fld_work_offs_start_date_half,
        fld_work_offs_end_date_half,
        fld_month,
        fld_year,
    });

    try {
        const savedWorkoff = await newWorkoff.save();
        res.status(201).json(savedWorkoff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a workoff
exports.updateWorkoff = async (req, res) => {
    const { id } = req.params;
    const { fld_adminid, fld_start_date, fld_end_date, fld_duration, fld_reason, fld_addedon, status, fld_work_off_added_by, fld_work_offs_start_date_half, fld_work_offs_end_date_half, fld_leave_type, fld_month, fld_year } = req.body;

    try {
        const updatedWorkoff = await Workoff.findOneAndUpdate(
            { id: id },
            { fld_adminid, fld_start_date, fld_end_date, fld_duration, fld_reason, fld_addedon, status, fld_work_off_added_by, fld_work_offs_start_date_half, fld_work_offs_end_date_half, fld_leave_type, fld_month, fld_year },
            { new: true }
        );

        if (!updatedWorkoff) return res.status(404).json({ message: 'Workoff not found' });
        res.status(200).json(updatedWorkoff);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a workoff
exports.deleteWorkoff = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedWorkoff = await Workoff.findOneAndDelete({ id: id });

        if (!deletedWorkoff) return res.status(404).json({ message: 'Workoff not found' });
        res.status(200).json({ message: 'Workoff deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
