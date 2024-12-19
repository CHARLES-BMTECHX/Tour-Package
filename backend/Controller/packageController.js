const Package = require('../Models/packageModel');
const Theme = require('../Models/themesModel');
const Address = require('../Models/addressModel'); 
const express = require('express');
const path = require('path');
const fs = require('fs');

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
      addressId, // Reference Address model
      bestMonth,
    } = req.body;

    // Parse categories and inclusions (if sent as JSON strings)
    const parsedCategories = categories ? JSON.parse(categories) : ['normal'];
    const parsedInclusions = inclusions ? JSON.parse(inclusions) : [];

    // Handle uploaded images
    let imagePaths = [];
    if (req.files) {
      imagePaths = req.files.map((file) => file.path); // Store file paths
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
      addressId, // Use the addressId reference
      bestMonth,
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

// **GET**: Get all packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate('themeId', 'name') // Populate theme details
      .populate('userId', 'username email') // Populate user details
      .populate('addressId', 'country state city'); // Populate address details

    if (!packages || packages.length === 0) {
      return res.status(404).json({ error: 'No packages found' });
    }

    res.status(200).json({
      message: 'Packages fetched successfully',
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving packages',
      details: error.message,
    });
  }
};

// **GET**: Get filtered packages
// const getFilteredPackages = async (req, res) => {
//   try {
//     const packages = await Package.find()
//       .populate('themeId', 'name') // Populate theme details
//       .populate('addressId', 'country state city'); // Populate address details

//     if (!packages || packages.length === 0) {
//       return res.status(404).json({ error: 'No packages found' });
//     }

//     // Group packages by address (state and city)
//     const groupedPackages = {};
//     packages.forEach((pkg) => {
//       const address = pkg.addressId;
//       if (!address) return;

//       const stateKey = address.state;
//       if (!groupedPackages[stateKey]) {
//         groupedPackages[stateKey] = {};
//       }

//       const cityKey = address.city;
//       if (!groupedPackages[stateKey][cityKey]) {
//         groupedPackages[stateKey][cityKey] = [];
//       }

//       groupedPackages[stateKey][cityKey].push(pkg);
//     });

//     res.status(200).json({
//       message: 'Filtered packages fetched successfully',
//       data: groupedPackages,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: 'Error filtering packages',
//       details: error.message,
//     });
//   }
// };
const getFilteredPackages = async (req, res) => {
  try {
    const categories = {
      TRENDING: 'trending',
      TOP: 'top destination',
      THEMES: ['HONEYMOON', 'WILDLIFE', 'HILLSTATIONS', 'PILGRIMAGE', 'HERITAGE', 'BEACH'],
    };

    // Fetch all packages and populate related fields
    const packages = await Package.find()
      .populate('themeId', 'name') // Populate theme details
      .populate('addressId', 'country state city description type stateImage startingPrice') // Populate address details
      .populate('userId', 'username email'); // Populate user details

    if (!packages || packages.length === 0) {
      return res.status(404).json({ error: 'No packages found' });
    }

    // Initialize grouped response
    const groupedCategories = {};

    // Helper function to group packages by state and city
    const groupByStateAndCity = (filteredPackages) => {
      const grouped = {};

      filteredPackages.forEach((pkg) => {
        const address = pkg.addressId;

        // Skip packages without an addressId
        if (!address) return;

        const stateKey = address.state;
        if (!grouped[stateKey]) {
          grouped[stateKey] = {
            stateName: stateKey,
            stateDetails: {
              description: address.description,
              country: address.country,
              type: address.type,
              stateImage: address.stateImage,
              startingPrice: address.startingPrice || Infinity,
            },
            cities: {},
          };
        }

        const cityKey = address.city;
        if (!grouped[stateKey].cities[cityKey]) {
          grouped[stateKey].cities[cityKey] = [];
        }

        grouped[stateKey].cities[cityKey].push({
          packageId: pkg._id,
          name: pkg.name,
          theme: pkg.themeId ? pkg.themeId.name : null,
          user: pkg.userId ? { username: pkg.userId.username, email: pkg.userId.email } : null,
          price: pkg.price,
          duration: pkg.duration,
          inclusions: pkg.inclusions,
          images: pkg.images,
          description: pkg.packageDescription,
          bestMonth: pkg.bestMonth,
        });

        // Update the state's starting price with the lowest package price
        grouped[stateKey].stateDetails.startingPrice = Math.min(
          grouped[stateKey].stateDetails.startingPrice,
          pkg.price
        );
      });

      // Add city count for each state
      Object.keys(grouped).forEach((state) => {
        grouped[state].cityCount = Object.keys(grouped[state].cities).length;
      });

      return grouped;
    };

    // Group packages for TRENDING category
    const trendingPackages = packages.filter((pkg) => pkg.categories.includes(categories.TRENDING));
    groupedCategories['TRENDING_DESTINATIONS'] = groupByStateAndCity(trendingPackages);

    // Group packages for TOP DESTINATION category
    const topDestinationPackages = packages.filter((pkg) => pkg.categories.includes(categories.TOP));
    groupedCategories['TOP_DESTINATIONS'] = groupByStateAndCity(topDestinationPackages);

    // Group packages for each theme
    categories.THEMES.forEach((themeName) => {
      const themePackages = packages.filter(
        (pkg) => pkg.themeId && pkg.themeId.name.toUpperCase() === themeName
      );
      groupedCategories[`${themeName.toUpperCase()}_DESTINATIONS`] = groupByStateAndCity(themePackages);
    });

    res.status(200).json({
      message: 'Packages grouped by categories fetched successfully',
      data: groupedCategories,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching packages by categories',
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
      .populate('userId', 'username email')
      .populate('addressId', 'country state city');

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
      addressId,
      bestMonth,
    } = req.body;

    const parsedCategories = categories ? JSON.parse(categories) : [];
    const parsedInclusions = inclusions ? JSON.parse(inclusions) : [];

    // Find the existing package
    const existingPackage = await Package.findById(id);
    if (!existingPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Define the package folder path
    const packageFolder = path.resolve('uploads', 'packages', existingPackage.name);

    // Remove all existing files in the package folder if the folder exists
    if (fs.existsSync(packageFolder)) {
      const files = fs.readdirSync(packageFolder); // Get all files in the folder
      files.forEach((file) => {
        const filePath = path.join(packageFolder, file);
        fs.unlinkSync(filePath); // Delete each file
      });
    } else {
      // If the folder doesn't exist, create it
      fs.mkdirSync(packageFolder, { recursive: true });
    }

    // Handle new files
    const updatedImages = [];
    if (req.files) {
      req.files.forEach((file) => {
        const newImagePath = file.path;
        updatedImages.push(newImagePath); // Add new file paths to the images array
      });
    }

    // Update the package in the database
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
        addressId,
        bestMonth,
      },
      { new: true, runValidators: true } // Return the updated document and validate fields
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

// **GET**: Retrieve an image
const getImage = async (req, res) => {
  try {
    const { packageName, fileName } = req.query; // Extract from query parameters

    if (!packageName || !fileName) {
      return res.status(400).json({ error: 'Both packageName and fileName are required' });
    }

    // Construct the file path dynamically
    const filePath = path.resolve('uploads','packages',packageName,fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      return res.status(200).sendFile(filePath); // Serve the image file
    }

    // File not found
    res.status(404).json({ error: 'Image not found' });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      error: 'An error occurred while retrieving the image',
      details: error.message,
    });
  }
};


module.exports = {
  createPackage,
  getAllPackages,
  getFilteredPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  getImage,
};



