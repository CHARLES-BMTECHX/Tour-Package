const Package = require('../Models/packageModel');

// **POST**: Create a new package
const createPackage = async (req, res) => {
  try {
    const {
      name,
      themeId,
      userId,
      price,
      duration,
      inclusions,
      packageDescription,
      categories,
      locationDetails, // Destructure locationDetails as an object
      bestMonth, // Add bestMonth
    } = req.body;

    // Parse categories and inclusions (if sent as JSON strings)
    const parsedCategories = categories ? JSON.parse(categories) : ['normal'];
    const parsedInclusions = inclusions ? JSON.parse(inclusions) : [];

    // Handle uploaded images
    let imagePaths = [];
    if (req.files) {
      imagePaths = req.files.map(file => file.path); // Store file paths
    }

    // Create a new package
    const newPackage = new Package({
      name,
      themeId,
      userId,
      price,
      duration,
      inclusions: parsedInclusions,
      images: imagePaths,
      packageDescription,
      categories: parsedCategories,
      locationDetails, // Use the entire locationDetails object directly
      bestMonth, // Include bestMonth
    });

    // Save to the database
    await newPackage.save();

    res.status(201).json({
      message: 'Package created successfully',
      package: newPackage,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error creating package',
      details: error.message,
    });
  }
};

// **GET**: Retrieve all packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate('themeId', 'name') // Populate theme with specific fields
      .populate('userId', 'username email'); // Populate user with specific fields

    if (!packages.length) {
      return res.status(404).json({ error: 'No packages found' });
    }

    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving packages',
      details: error.message,
    });
  }
};

// **GET**: Retrieve a single package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await Package.findById(id)
      .populate('themeId', 'name')
      .populate('userId', 'username email');

    if (!package) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving package',
      details: error.message,
    });
  }
};

// **PUT**: Update a package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      themeId,
      userId,
      price,
      duration,
      inclusions,
      packageDescription,
      categories,
      country,
      state,
      city,
      description,
      startingPrice,
      tourType,
      bestMonth, // Add bestMonth for updates
    } = req.body;

    // Parse categories and inclusions (if sent as JSON strings)
    const parsedCategories = categories ? JSON.parse(categories) : [];
    const parsedInclusions = inclusions ? JSON.parse(inclusions) : [];

    // Handle uploaded images (append to existing ones)
    const existingPackage = await Package.findById(id);
    if (!existingPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    let updatedImages = existingPackage.images;
    if (req.files) {
      const newImagePaths = req.files.map(file => file.path); // Get new image paths
      updatedImages = [...updatedImages, ...newImagePaths]; // Append new images
    }

    // Update package
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      {
        name,
        themeId,
        userId,
        price,
        duration,
        inclusions: parsedInclusions,
        images: updatedImages,
        packageDescription,
        categories: parsedCategories,
        locationDetails: {
          country,
          state,
          city,
          description,
          startingPrice,
          tourType,
        },
        bestMonth, // Update bestMonth
      },
      { new: true, runValidators: true } // Return updated document and validate fields
    );

    res.status(200).json({
      message: 'Package updated successfully',
      package: updatedPackage,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error updating package',
      details: error.message,
    });
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

    res.status(200).json({
      message: 'Package deleted successfully',
      package: deletedPackage,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting package',
      details: error.message,
    });
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
