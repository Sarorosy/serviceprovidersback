const EndService = require('../models/Endservices');

// Submit an end service request
exports.submitRequest = async (req, res) => {
    try {
        const { sp_id, reason, proposed_end_date, comments } = req.body;

        const newRequest = new EndService({
            sp_id,
            reason,
            proposed_end_date,
            comments,
            request_date: new Date(),
            status: 'Pending',
        });

        const savedRequest = await newRequest.save();
        res.status(201).json({ message: 'Request submitted successfully', data: savedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit request', error });
    }
};

// Fetch all end service requests (Admin)
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await EndService.find().populate('sp_id', 'name email');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch requests', error });
    }
};

exports.getRequestsByUserId = async (req, res) => {
    try {
        const { id } = req.params; // Assuming `id` is passed as a route parameter
        const requests = await EndService.find({ sp_id: id });

        if (requests.length === 0) {
            return res.status(404).json({ message: 'No requests found for this user' });
        }

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch requests', error });
    }
};

// Update the status of a request (Approve/Reject)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_comments } = req.body;

        const updatedRequest = await EndService.findByIdAndUpdate(
            id,
            { status, admin_comments },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request status updated', data: updatedRequest });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update status', error });
    }
};
