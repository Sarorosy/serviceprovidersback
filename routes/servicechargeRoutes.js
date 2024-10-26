const express = require('express');
const router = express.Router();
const servicechargeController = require('../controllers/servicechargeController');

// GET all service charges
router.get('/', servicechargeController.getAllServiceCharges);

// POST create a new service charge
router.post('/', servicechargeController.createServiceCharge);

// GET a specific service charge by ID
router.get('/:id', servicechargeController.getServiceChargeById);

// PUT update a service charge by ID
router.put('/:id', servicechargeController.updateServiceCharge);

// DELETE a service charge by ID
router.delete('/:id', servicechargeController.deleteServiceCharge);

module.exports = router;
