const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  getServiceProviders,
  getActiveServiceProviders,
  getInActiveServiceProviders,
  getServiceProviderById,
  getServiceProviderFindById,
  updatePassword,
  updateAllPasswords,
  logoutUser,
  toggleStatusForUser,
  approveFile,
  fileRequest,
  checkWebCode,
  checkQuitStatus,
  getAbsentServiceProviderEmails,
  getAbsentServiceProviderEmailData
} = require('../controllers/userController');

// Set up multer storage configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    switch (file.fieldname) {
      case 'fld_profile_image':
        cb(null, 'uploads/profileimg');
        break;
      case 'fld_aadharcard':
        cb(null, 'uploads/aadharcard');
        break;
      case 'fld_pancard':
        cb(null, 'uploads/pancard');
        break;
      case 'fld_cancelledchequeimage':
        cb(null, 'uploads/cancelledchequeimage');
        break;
      default:
        // Ignore unknown fields
        cb(null, false); // Skips saving the file
        break;
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Define multer middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  }
});

// Handle multiple file uploads
const multiUpload = upload.fields([
  { name: 'fld_profile_image', maxCount: 1 },
  { name: 'fld_aadharcard', maxCount: 1 },
  { name: 'fld_pancard', maxCount: 1 },
  { name: 'fld_cancelledchequeimage', maxCount: 1 }
]);

// CRUD routes
router.get('/', getUsers);
router.get("/absentuserslist", getAbsentServiceProviderEmails);
router.get("/absentusersemails", getAbsentServiceProviderEmailData);
router.get('/serviceproviders', getServiceProviders);
router.get('/activeserviceproviders', getActiveServiceProviders);
router.get('/inactiveserviceproviders', getInActiveServiceProviders);
router.get('/:id', getServiceProviderById);
router.get('/find/:id', getServiceProviderFindById);
router.put('/:id/password', updatePassword);
router.post('/new', multiUpload, createUser);
router.put('/:id', multiUpload, updateUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.patch('/update-passwords', updateAllPasswords);
router.patch('/:id/status', toggleStatusForUser);
// New route to handle file approval
router.patch('/approvefile', approveFile);
router.post('/approvefiles', approveFile);
router.post('/filerequest', fileRequest);

router.post('/check-web-code', checkWebCode);
router.post('/check-quit-status', checkQuitStatus);



module.exports = router;
