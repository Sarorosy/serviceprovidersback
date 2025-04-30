const express = require('express');
const router = express.Router();
const {createLoginHistory, getAllLoginHistory,updateLoginHistory,deleteLoginHistory,getAllLoginHistoryById, checkLoginStatus} = require('../controllers/loginHistoryController');



// Create a new login history entry
router.post('/', createLoginHistory);

// Get all login history entries
router.get('/', getAllLoginHistory);
router.get('/:id', getAllLoginHistoryById);
router.get('/user/:id', getAllLoginHistoryById);
// Update a login history entry
router.put('/:id', updateLoginHistory);

// Delete a login history entry
router.delete('/:id', deleteLoginHistory);
router.post('/check-login-status', checkLoginStatus);
module.exports = router;
