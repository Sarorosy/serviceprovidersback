const Servicecharge = require('../models/Servicecharge');

// Get all service charges
exports.getAllServiceCharges = async (req, res) => {
    try {
        const serviceCharges = await Servicecharge.find();
        res.json(serviceCharges);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new service charge
exports.createServiceCharge = async (req, res) => {
    const { fld_service_provider_id, fld_from_date, fld_to_date, fld_service_charge, fld_from_to_dates } = req.body;
    
    const newServiceCharge = new Servicecharge({
        fld_service_provider_id,
        fld_from_date,
        fld_to_date,
        fld_service_charge,
        fld_from_to_dates
    });

    try {
        const savedServiceCharge = await newServiceCharge.save();
        res.status(201).json(savedServiceCharge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get a single service charge by ID
exports.getServiceChargeById = async (req, res) => {
    try {
        const serviceCharge = await Servicecharge.findById(req.params.id);
        if (!serviceCharge) return res.status(404).json({ message: 'Service charge not found' });
        res.json(serviceCharge);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a service charge by ID
exports.updateServiceCharge = async (req, res) => {
    try {
        const updatedServiceCharge = await Servicecharge.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedServiceCharge) return res.status(404).json({ message: 'Service charge not found' });
        res.json(updatedServiceCharge);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a service charge by ID
exports.deleteServiceCharge = async (req, res) => {
    try {
        const serviceCharge = await Servicecharge.findByIdAndDelete(req.params.id);
        if (!serviceCharge) return res.status(404).json({ message: 'Service charge not found' });
        res.json({ message: 'Service charge deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
