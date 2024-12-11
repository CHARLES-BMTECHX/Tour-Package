const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theme name is required'],
    unique: true,
    enum: [
      'HONEYMOON',
      'HILL STATIONS',
      'WILDLIFE',
      'PILGRIMAGE',
      'HERITAGE',
      'BEACH'
    ],
    uppercase: true, // Enforce uppercase for consistency
  },
  description: {
    type: String,
    required: false, // Optional field
    trim: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Theme model
const Theme = mongoose.model('Theme', themeSchema);

module.exports = Theme;
