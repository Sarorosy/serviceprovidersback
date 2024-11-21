const express = require('express');
const router = express.Router();
const endServicesController = require('../controllers/endservicesController');

// Route to submit an end service request
router.post('/submit', endServicesController.submitRequest);

// Route to fetch all end service requests for admin
router.get('/requests', endServicesController.getAllRequests);

router.get('/user/:id', endServicesController.getRequestsByUserId);

// Route to update the status of a request (Approve/Reject)
router.put('/update/:id', endServicesController.updateRequestStatus);

module.exports = router;
