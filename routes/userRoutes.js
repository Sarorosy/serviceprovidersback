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

// Set up multer storage configurations
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/profileimg'); // Directory for profile images
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Rename the file
    }
  });
  
  const aadharStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/aadharcard'); // Directory for Aadhar cards
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Rename the file
    }
  });
  
  const panStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/pancard'); // Directory for PAN cards
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Rename the file
    }
  });
  
  const chequeStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/cancelledchequeimage'); // Directory for cancelled cheque images
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Rename the file
    }
  });
  
  // Create multer instances for each storage
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        if (file.fieldname === 'fld_profile_image') {
          cb(null, 'uploads/profileimg');
        } else if (file.fieldname === 'fld_aadharcard') {
          cb(null, 'uploads/aadharcard');
        } else if (file.fieldname === 'fld_pancard') {
          cb(null, 'uploads/pancard');
        } else if (file.fieldname === 'fld_cancelledchequeimage') {
          cb(null, 'uploads/cancelledchequeimage');
        }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      }
    })
  });
  
  // Handle multiple file uploads in one request
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
