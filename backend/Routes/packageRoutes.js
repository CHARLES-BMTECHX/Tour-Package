const express = require('express');
const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getImage,
  getFilteredPackages,
} = require('../Controller/packageController');
const upload = require('../Middleware/uploadMiddleware'); // Import upload middleware

const router = express.Router();

// **POST**: Create a new package
router.post('/create-package', upload.any(), createPackage); // Allow unlimited images

// **GET**: Retrieve all packages
router.get('/get-all-packages', getAllPackages);

// **GET**: Retrieve filtered packages by categories
router.get('/get-packages-by-categories', getFilteredPackages);

// **GET**: Retrieve an image
router.get('/get-package-image', getImage);

// **GET**: Retrieve a package by ID (dynamic route)
router.get('/get-package-by-id/:id', getPackageById);

// **PUT**: Update a package by ID
router.put('/update-package/:id', upload.any(), updatePackage); // Allow updating with images

// **DELETE**: Delete a package by ID
router.delete('/delete-package/:id', deletePackage);

module.exports = router;
