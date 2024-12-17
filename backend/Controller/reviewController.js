const Review = require('../Models/reviewModel');

// **POST**: Create a new review
const createReview = async (req, res) => {
  try {
    const { tourRating, recommend, name, email, orderId, userId, comments } = req.body;

    // Check for required fields
    if (!tourRating || !name || !email || !orderId || !userId) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    // Create a new review
    const newReview = await Review.create({
      tourRating,
      recommend,
      name,
      email,
      orderId,
      userId,
      comments,
    });

    res.status(201).json({
      message: 'Review created successfully',
      review: newReview,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error creating review',
      details: error.message,
    });
  }
};

// **GET**: Retrieve all reviews
const getAllReviews = async (req, res) => {
  try {
    // Extract page and limit from query parameters, default to page 1 and limit 10
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const reviews = await Review.aggregate([
      // Match Booking table based on orderId in Review
      {
        $lookup: {
          from: 'bookings', // Booking collection
          localField: 'orderId', // orderId in Review
          foreignField: '_id', // _id in Booking
          as: 'bookingDetails',
        },
      },
      {
        $unwind: '$bookingDetails', // Flatten bookingDetails array
      },
      // Match Package table based on packageId in Booking
      {
        $lookup: {
          from: 'packages', // Package collection
          localField: 'bookingDetails.packageId', // packageId in Booking
          foreignField: '_id', // _id in Package
          as: 'packageDetails',
        },
      },
      {
        $unwind: '$packageDetails', // Flatten packageDetails array
      },
      // Project the fields you want to include in the response
      {
        $project: {
          _id: 1, // Review ID
          tourRating: 1,
          recommend: 1,
          name: 1,
          email: 1,
          comments: 1,
          createdAt: 1, // Include review creation date for sorting or display
          orderId: {
            _id: '$bookingDetails._id', // Booking ID
            price: '$bookingDetails.price',
            status: '$bookingDetails.status',
            adultCount: '$bookingDetails.adultCount',
            childCount: '$bookingDetails.childCount',
            date: '$bookingDetails.date',
            username: '$bookingDetails.username',
            email: '$bookingDetails.email',
            phoneNumber: '$bookingDetails.phoneNumber',
            packageId: {
              _id: '$packageDetails._id', // Package ID
              name: '$packageDetails.name',
              price: '$packageDetails.price',
              duration: '$packageDetails.duration',
              packageDescription: '$packageDetails.packageDescription',
            },
          },
        },
      },
      { $skip: skip }, // Skip documents for pagination
      { $limit: limit }, // Limit to the specified number of documents per page
    ]);

    // Fetch total count for pagination metadata
    const totalRecords = await Review.countDocuments();
    const totalPages = Math.ceil(totalRecords / limit);

    // Send paginated response
    res.status(200).json({
      page,
      limit,
      totalPages,
      totalRecords,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving reviews',
      details: error.message,
    });
  }
};



// **GET**: Retrieve a single review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id)
      .populate('orderId', 'orderNumber') // Populate specific fields from Order
      .populate('userId', 'name email'); // Populate specific fields from User

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving review',
      details: error.message,
    });
  }
};

// **PUT**: Update a review by ID
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate fields for update
    if (req.body.tourRating && (req.body.tourRating < 1 || req.body.tourRating > 5)) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5',
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // Return updated document and validate fields
    );

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error updating review',
      details: error.message,
    });
  }
};

// **DELETE**: Delete a review by ID
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review deleted successfully',
      data: deletedReview,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting review',
      details: error.message,
    });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
