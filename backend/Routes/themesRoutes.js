const express = require('express');
const {
  createTheme,
  getAllThemes,
  getThemeById,
  updateTheme,
  deleteTheme,
} = require('../Controller/themesController');

const router = express.Router();

// Route to create a new theme
router.post('/', createTheme);

// Route to get all themes
router.get('/', getAllThemes);

// Route to get a theme by ID
router.get('/:id', getThemeById);

// Route to update a theme by ID
router.put('/:id', updateTheme);

// Route to delete a theme by ID
router.delete('/:id', deleteTheme);

module.exports = router;
