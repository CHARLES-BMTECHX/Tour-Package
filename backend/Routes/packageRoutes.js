const express = require('express');
const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} = require('../Controller/packageController');
const upload = require('../Middleware/uploadMiddleware'); // Import upload middleware

const router = express.Router();

// **POST**: Create a new package
router.post('/', upload.any(), createPackage); // Allow unlimited images

// **GET**: Retrieve all packages
router.get('/', getAllPackages);

// **GET**: Retrieve a package by ID
router.get('/:id', getPackageById);

// **PUT**: Update a package by ID
router.put('/:id', upload.any(), updatePackage); // Allow updating with images

// **DELETE**: Delete a package by ID
router.delete('/:id', deletePackage);

module.exports = router;
