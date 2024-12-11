const mongoose = require('mongoose');

// Function to generate a unique order ID
const generateOrderId = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
  return `ORDER${randomNumber}`;
};

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: generateOrderId, // Automatically generate the order ID
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'User ID is required'],
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package', // Reference to the Package model
    required: [true, 'Package ID is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'], // Booking statuses
    default: 'Pending', // Default status
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
