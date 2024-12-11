const Package = require('../Models/packageModel'); // Import Package model

// **POST**: Create a new package
const createPackage = async (req, res) => {
  try {
    const packageData = req.body;

    // Store uploaded image paths
    if (req.files) {
      const imagePaths = req.files.map(file => file.path);
      packageData.images = imagePaths;
    }

    // Save the package
    const newPackage = new Package(packageData);
    await newPackage.save();

    res.status(201).json({ message: 'Package created successfully', package: newPackage });
  } catch (error) {
    res.status(400).json({ error: 'Error creating package: ' + error.message });
  }
};

// **GET**: Retrieve all packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find().populate('themeId').populate('userId'); // Populate references
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving packages: ' + error.message });
  }
};

// **GET**: Retrieve a single package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await Package.findById(id).populate('themeId').populate('userId');

    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving package: ' + error.message });
  }
};

// **PUT**: Update a package by ID
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Append new image paths if files are uploaded
    if (req.files) {
      const imagePaths = req.files.map(file => file.path);
      updatedData.images = imagePaths;
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Return updated document and validate fields
    );

    if (!updatedPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.status(200).json({ message: 'Package updated successfully', package: updatedPackage });
  } catch (error) {
    res.status(400).json({ error: 'Error updating package: ' + error.message });
  }
};

// **DELETE**: Delete a package by ID
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.status(200).json({ message: 'Package deleted successfully', package: deletedPackage });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting package: ' + error.message });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
