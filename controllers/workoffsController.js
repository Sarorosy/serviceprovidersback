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

exports.calculateLeaveBalance = async (req, res) => {
    const { start_date, fld_adminid } = req.body;

    if (!start_date || !fld_adminid) {
        return res.status(400).json({ message: "start_date and fld_adminid are required." });
    }

    try {
        const startDate = new Date(start_date);
        const now = new Date();

        console.log("Start Date:", startDate);
        console.log("Now Date:", now);

        // Calculate the month difference between start_date and now
        const monthDifference = (now.getFullYear() - startDate.getFullYear()) * 12 + (now.getMonth() - startDate.getMonth());

        // If the month difference is less than or equal to 8, accumulate 0.5 leaves per month
        let totalAccumulatedLeaves = monthDifference <= 8 ? monthDifference * 0.5 : 8;

        // Debugging the query
        console.log("Fetching workoffs for admin:", fld_adminid);
        console.log("Date Range for Query: ", startDate, now);

        // Fetch workoffs for the admin (leaves taken)
        const workoffs = await Workoff.find({
            fld_adminid,
            fld_addedon: { $gte: startDate, $lte: now }  // If you want to filter by fld_addedon
        });
        

        console.log("Fetched Workoffs:", workoffs); // Debugging to ensure workoffs are fetched correctly

        // Calculate total leaves taken from workoffs
        let totalLeavesTaken = 0;
        workoffs.forEach((workoff) => {
            const duration = parseFloat(workoff.fld_duration) || 0; // Ensure fld_duration is parsed as a number
            console.log(`Adding duration for workoff: ${duration}`); // Debugging for each workoff
            totalLeavesTaken += duration;
        });

        // Ensure totalLeavesTaken is correctly calculated
        console.log("Total Leaves Taken:", totalLeavesTaken); // Debugging total leaves taken

        // Calculate leave balance (accumulated leaves - leaves taken)
        let leaveBalance = totalAccumulatedLeaves - totalLeavesTaken;

        // Ensure leave balance is non-negative
        leaveBalance = Math.max(leaveBalance, 0);

        // Return response with calculated values
        res.status(200).json({
            totalLeavesAllowed: 8, // Total leaves allowed for the year
            leaveBalance: leaveBalance,
            totalLeavesTaken: totalLeavesTaken,
            totalAccumulatedLeaves: totalAccumulatedLeaves, // Total accumulated leaves for the year
        });
    } catch (error) {
        console.error("Error calculating leave balance:", error);
        res.status(500).json({ message: "An error occurred while calculating leave balance." });
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
