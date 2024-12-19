const Theme = require('../Models/themesModel'); // Import the Theme model
const multer = require('multer');
 const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const themeName = req.body.name ? req.body.name.toUpperCase() : 'DEFAULT';
        const uploadPath = path.join('uploads', 'themes', themeName);
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Get all themes
const getAllThemes = async (req, res) => {
    try {
      const themesWithCounts = await Theme.aggregate([
        {
          $lookup: {
            from: "packages", // The collection name for packages
            localField: "_id", // The field in themes to match
            foreignField: "themeId", // The field in packages to match
            as: "relatedPackages", // Alias for the joined data
          },
        },
        {
          $addFields: {
            packageCount: { $size: "$relatedPackages" }, // Calculate the number of related packages
          },
        },
        {
          $project: {
            _id: 1,
            themename: "$name", // Rename `name` to `themename`
            description: 1,
            themeImage: 1, // Include themeImage field
            packageCount: 1, // Include package count
          },
        },
      ]);
  
      // Format data as an object where each key is the theme name
      const categorizedThemes = {};
      themesWithCounts.forEach((theme) => {
        categorizedThemes[theme.themename.toUpperCase()] = {
          _id: theme._id,
          themename: theme.themename,
          description: theme.description,
          themeImage: theme.themeImage,
          packageCount: theme.packageCount,
        };
      });
  
      res.status(200).json({
        message: "Themes grouped by categories fetched successfully",
        data: categorizedThemes,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error retrieving themes with package counts",
        details: error.message,
      });
    }
  };
  

// Get a theme by ID
    const getThemeById = async (req, res) => {
        try {
            const { id } = req.params;
            const theme = await Theme.findById(id);

            if (!theme) {
                return res.status(404).json({ error: 'Theme not found' });
            }

            res.status(200).json(theme);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving theme: ' + error.message });
        }
    };

// Get an image by path
const getImageByPath = (req, res) => {
    try {
        const { themeName, fileName } = req.params;
        const filePath = path.join('uploads', 'themes', themeName, fileName);
      console.log('filegeet',filePath);
      
        if (fs.existsSync(filePath)) {
            return res.status(200).sendFile(path.resolve(filePath));
        }

        res.status(404).json({ error: 'File not found' });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving file: ' + error.message });
    }
};
const getImageByQuery = (req, res) => {
  try {
      const { themeName, fileName } = req.query; // Extract from query parameters

      if (!themeName || !fileName) {
          return res.status(400).json({ error: 'Both themeName and fileName are required' });
      }

      const filePath = path.join('uploads', 'themes', themeName, fileName);

      // Check if the file exists
      if (fs.existsSync(filePath)) {
          return res.status(200).sendFile(path.resolve(filePath));
      }

      // File not found
      res.status(404).json({ error: 'File not found' });
  } catch (error) {
      res.status(500).json({ error: 'Error retrieving file: ' + error.message });
  }
};

// Create a new theme
const createTheme = async (req, res) => {
    try {
        const { name, description } = req.body;
        const themeImage = req.file ? req.file.path : null;

        if (!name) {
            return res.status(400).json({ error: 'Theme name is required' });
        }

        const newTheme = new Theme({ name, description, themeImage });
        await newTheme.save();

        res.status(201).json({ message: 'Theme created successfully', theme: newTheme });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Theme name must be unique' });
        }
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};

// Update a theme by ID
const updateTheme = async (req, res) => {
  try {
    const { id } = req.query; // Extract theme ID from query parameters
    const { name, description } = req.body; // Extract form-data fields
    const themeImage = req.file ? req.file.path : null; // Get uploaded file path

    if (!id) {
        return res.status(400).json({ error: 'Theme ID is required' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (themeImage) updateData.themeImage = themeImage;

    const updatedTheme = await Theme.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true } // Return updated document and validate
    );

    if (!updatedTheme) {
        return res.status(404).json({ error: 'Theme not found' });
    }

    res.status(200).json({ message: 'Theme updated successfully', theme: updatedTheme });
} catch (error) {
    res.status(400).json({ error: 'Error updating theme: ' + error.message });
}
};



// Delete a theme by ID
const deleteTheme = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTheme = await Theme.findByIdAndDelete(id);

        if (!deletedTheme) {
            return res.status(404).json({ error: 'Theme not found' });
        }

        if (deletedTheme.themeImage && fs.existsSync(deletedTheme.themeImage)) {
            fs.unlinkSync(deletedTheme.themeImage);
        }

        res.status(200).json({ message: 'Theme deleted successfully', theme: deletedTheme });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting theme: ' + error.message });
    }
};

module.exports = {
    createTheme: [upload.single('themeImage'), createTheme],
    getAllThemes,
    getThemeById,
    getImageByPath,
    updateTheme: [upload.single('themeImage'), updateTheme],
    deleteTheme,
    getImageByQuery
};
