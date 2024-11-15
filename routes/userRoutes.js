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
} = require('../controllers/userController');

// Set up multer storage configurations for each type of file
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profileimg');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const aadharStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/aadharcard');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const panStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pancard');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const chequeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cancelledchequeimage');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Define multer for file uploads, only for provided fields
const upload = multer({
  storage: (req, file, cb) => {
    if (file.fieldname == 'fld_profile_image') {
      cb(null, 'uploads/profileimg');
    } else if (file.fieldname == 'fld_aadharcard') {
      cb(null, 'uploads/aadharcard');
    } else if (file.fieldname == 'fld_pancard') {
      cb(null, 'uploads/pancard');
    } else if (file.fieldname == 'fld_cancelledchequeimage') {
      cb(null, 'uploads/cancelledchequeimage');
    }else {
      cb(new Error('Unknown field' + file.fieldname));  // handle unknown fields
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // Example: limit file size to 10MB
  }
});

// Handle multiple file uploads conditionally
const multiUpload = upload.fields([
  { name: 'fld_profile_image', maxCount: 1 },
  { name: 'fld_aadharcard', maxCount: 1 },
  { name: 'fld_pancard', maxCount: 1 },
  { name: 'fld_cancelledchequeimage', maxCount: 1 }
]);

// CRUD routes
router.get('/', getUsers);
router.get('/serviceproviders', getServiceProviders);
router.get('/activeserviceproviders', getActiveServiceProviders);
router.get('/inactiveserviceproviders', getInActiveServiceProviders);
router.get('/:id', getServiceProviderById);
router.get('/find/:id', getServiceProviderFindById);
router.put('/:id/password', updatePassword);
router.post('/', multiUpload, createUser);
router.put('/:id', multiUpload, updateUser);
router.delete('/:id', deleteUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.patch('/update-passwords', updateAllPasswords);
router.patch('/:id/status', toggleStatusForUser);

module.exports = router;
