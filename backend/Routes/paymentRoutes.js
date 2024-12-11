const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments } = require('../Controller/paymentController'); // Import controllers

// Route to handle POST request for creating a payment
router.post('/payments', createPayment);

// Route to handle GET request for fetching all payments
router.get('/payments', getAllPayments);

module.exports = router;
