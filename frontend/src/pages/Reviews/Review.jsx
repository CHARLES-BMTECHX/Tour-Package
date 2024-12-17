import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

const Review = () => {
  const [reviews, setReviews] = useState([]); // State to store fetched reviews
  const [page, setPage] = useState(1); // Current page for pagination
  const [hasMore, setHasMore] = useState(true); // Track if there are more records to fetch
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const navigate=useNavigate();

  const baseurl = import.meta.env.VITE_BASE_URL; // Base URL for API

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${baseurl}/reviews`, {
        params: { page, limit: 10 }, // Send page and limit as query parameters
      });
      const fetchedReviews = response.data.reviews;
      const totalPages = response.data.totalPages;

      // Append new reviews to existing state
      setReviews((prevReviews) => [...prevReviews, ...fetchedReviews]);

      // Check if there are more pages
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
    }
  };

  // Initial fetch of reviews
  useEffect(() => {
    fetchReviews();
  }, [page]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  // Helper function to render stars dynamically
  const renderStars = (rating) => {
    const fullStar = "★";
    const emptyStar = "☆";
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
  };

  const handleReadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment page to fetch next records
    }
  };

  const handleWriteReview = () => {
    navigate('/write-review');
  };

  return (
    <div className="container mt-5 review-carousel">
      <div className="d-flex justify-content-center flex-column">
        <h1 className="text-center text-dark mb-4">
          Over 40 Lac+ Happy Travelers
        </h1>
        <p className="text-dark text-center">
          Real travelers. Real stories. Real opinions to help you make the right choice.
        </p>
      </div>

      {/* Custom Navigation Buttons */}
      <div className="custom-navigation">
        <button
          ref={prevRef}
          className="btn prev-button"
          style={{ color: "#ef156c" }}
        >
          &#9664; {/* Left Arrow */}
        </button>
        <button
          ref={nextRef}
          className="btn next-button"
          style={{ color: "#ef156c" }}
        >
          &#9654; {/* Right Arrow */}
        </button>
      </div>

      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        slidesPerView={2}
        spaceBetween={30}
        pagination={false} // Disable bullet points
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
        }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index}>
            <div className="card p-3 shadow-sm">
              <div className="d-flex justify-content-between mb-3">
                {/* Avatar and Name */}
                <div className="d-flex align-items-center">
                  <div className="avatar me-3">
                    {review.name.charAt(0).toUpperCase()} {/* First letter of name */}
                  </div>
                  <div>
                    <h5 className="mb-0">{review.name}</h5>
                    <small className="text-muted">{review.orderId.username}</small>
                  </div>
                </div>
                {/* Date */}
                <div className="text-muted small">
                  {new Date(review.orderId.date).toLocaleDateString()} {/* Format Date */}
                </div>
              </div>
              {/* Rating */}
              <div className="rating mb-3 text-muted">
                {renderStars(review.tourRating)} {/* Dynamic Rating */}
              </div>
              {/* Comments */}
              <p className="fw-bold mb-2">{review.comments}</p>
              {/* Package Details */}
              <p>
                <strong>Package:</strong> {review.orderId.packageId.name}
              </p>
              <p>
                <strong>Description:</strong> {review.orderId.packageId.packageDescription}
              </p>
              <p>
                <strong>Duration:</strong> {review.orderId.packageId.duration}
              </p>
              <small className="text-muted">
                <strong>Price:</strong> ${review.orderId.packageId.price}
              </small>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Read More and Write Review Buttons */}
      <div className="d-flex justify-content-center mt-4 gap-3">
        {hasMore && (
          <button
            className="btn btn-primary"
            onClick={handleReadMore}
          >
            Read More Reviews
          </button>
        )}
        <button
          className="btn btn-success"
          onClick={handleWriteReview}
        >
          Write Review
        </button>
      </div>
    </div>
  );
};

export default Review;
