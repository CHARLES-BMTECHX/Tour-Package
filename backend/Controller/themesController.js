const Theme = require('../Models/themesModel'); // Import the Theme model
// Get all themes
const getAllThemes = async (req, res) => {
    try {
      const themes = await Theme.find();
      res.status(200).json(themes);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving themes: ' + error.message });
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
  
// Controller for creating a new theme
const createTheme = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Theme name is required' });
    }

    // Create a new theme
    const newTheme = new Theme({ name, description });
    await newTheme.save();

    res.status(201).json({ message: 'Theme created successfully', theme: newTheme });
  } catch (error) {
    if (error.code === 11000) {
      // Handle unique constraint errors
      return res.status(400).json({ error: 'Theme name must be unique' });
    }
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Update a theme by ID
const updateTheme = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
  
      const updatedTheme = await Theme.findByIdAndUpdate(
        id,
        { name, description },
        { new: true, runValidators: true } // Return the updated document and validate
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
  
      res.status(200).json({ message: 'Theme deleted successfully', theme: deletedTheme });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting theme: ' + error.message });
    }
  };
  

module.exports = { 
    createTheme,
    deleteTheme,
    updateTheme,
    getThemeById,
    getAllThemes
};
