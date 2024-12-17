const express = require('express');
const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require('../Controller/reviewController');

const router = express.Router();

// **POST**: Create a new review
router.post('/', createReview);

// **GET**: Retrieve all reviews
router.get('/', getAllReviews);

// **GET**: Retrieve a single review by ID
router.get('/:id', getReviewById);

// **PUT**: Update a review by ID
router.put('/:id', updateReview);

// **DELETE**: Delete a review by ID
router.delete('/:id', deleteReview);

module.exports = router;
