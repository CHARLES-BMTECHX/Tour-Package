const express = require('express');
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require('../Controller/bookingController');

const router = express.Router();

// **POST**: Create a new booking
router.post('/', createBooking);

// **GET**: Retrieve all bookings
router.get('/', getAllBookings);

// **GET**: Retrieve a booking by ID
router.get('/:id', getBookingById);

// **PUT**: Update a booking by ID
router.put('/:id', updateBooking);

// **DELETE**: Delete a booking by ID
router.delete('/:id', deleteBooking);

module.exports = router;
