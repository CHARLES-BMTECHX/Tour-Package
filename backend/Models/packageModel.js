const mongoose = require('mongoose');

// Define the package schema
const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
    },
    themeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theme', // Reference to the Theme model
      required: [true, 'Theme ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'User ID is required'], // Ensures we know who added the package
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    duration: {
      type: String,
      required: [true, 'Duration is required'],
    },
    inclusions: {
      type: [String],
      default: [], // Optional field, defaults to an empty array
    },
    images: {
      type: [String],
      default: [], // Optional field, defaults to an empty array
    },
    packageDescription: {
      type: String,
      required: [true, 'Package description is required'],
    },
    categories: {
      type: [String],
      default: ["normal"], // Default value set to ["normal"]
      enum: ["normal", "trending", "top destination"], // Restricts values to these options
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address', // Reference to the Address model
      required: [true, 'Address ID is required'],
    },
    bestMonth: {
      type: String,
      required: [true, 'Best month is required'],
      // validate: {
      //   validator: function (value) {
      //     // Regex to match format like "December, 2024"
      //     return /^[A-Za-z]+,\s\d{4}$/.test(value);
      //   },
      //   message: 'Best month must be in the format "Month, YYYY"',
      // },
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the Package model
const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
