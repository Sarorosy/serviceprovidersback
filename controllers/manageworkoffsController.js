const ManageWorkoff = require('../models/ManageWorkoff');

// Get all workoffs
exports.getAllWorkoffs = async (req, res) => {
    try {
        const workoffs = await ManageWorkoff.find().sort({ id: -1 });
        res.status(200).json(workoffs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get workoff by ID
exports.getWorkoffById = async (req, res) => {
    const { id } = req.params;

    try {
        const workoff = await ManageWorkoff.find({ fld_adminid: id });

        if (!workoff) return res.status(404).json({ message: 'Workoff not found' });

        res.status(200).json(workoff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get workoff by ID
exports.getWorkoffByIdFirstCollection = async (req, res) => {
    const { id } = req.params;

    try {
        const workoff = await ManageWorkoff.findOne({ fld_adminid: id });

        if (!workoff) return res.status(404).json({ message: 'Workoff not found' });

        res.status(200).json(workoff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new workoff
exports.createWorkoff = async (req, res) => {
    const { fld_adminid, fld_workoffs_startdate, fld_workoffs_enddate, fld_total_no_of_work_offs, fld_work_offs_availed, fld_work_offs_balance, fld_addedon, fld_updated_at, fld_from_to_dates } = req.body;

    const newWorkoff = new ManageWorkoff({
        fld_adminid,
        fld_workoffs_startdate,
        fld_workoffs_enddate,
        fld_total_no_of_work_offs,
        fld_work_offs_availed,
        fld_work_offs_balance,
        fld_addedon,
        fld_updated_at,
        fld_from_to_dates,
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
    const { fld_adminid, fld_workoffs_startdate, fld_workoffs_enddate, fld_total_no_of_work_offs, fld_work_offs_availed, fld_work_offs_balance, fld_addedon, fld_updated_at, fld_from_to_dates } = req.body;

    try {
        const updatedWorkoff = await ManageWorkoff.findOneAndUpdate(
            { id: id },
            { fld_adminid, fld_workoffs_startdate, fld_workoffs_enddate, fld_total_no_of_work_offs, fld_work_offs_availed, fld_work_offs_balance, fld_addedon, fld_updated_at, fld_from_to_dates },
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
        const deletedWorkoff = await ManageWorkoff.findByIdAndDelete(id);

        if (!deletedWorkoff) return res.status(404).json({ message: 'Workoff not found' });
        res.status(200).json({ message: 'Workoff deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
