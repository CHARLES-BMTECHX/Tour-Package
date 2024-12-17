import React,{useEffect} from "react";
import leftImage from "../images/gif-1.gif";
import rightImage from "../images/gif-2.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendarAlt,
  faSearch,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as jwtDecode from "jwt-decode"; 

import Review from "./Reviews/Review";

const packages = [
  {
    name: "Kerala Backwaters",
    locationDetails: {
      state: "Kerala",
      city: "Alleppey",
    },
    duration: "2 to 3",
    bestMonth: "December, 2024",
  },
  {
    name: "Rajasthan Desert Safari",
    locationDetails: {
      state: "Rajasthan",
      city: "Jaisalmer",
    },
    duration: "3 to 5",
    bestMonth: "November, 2024",
  },
  {
    name: "Himachal Hill Retreat",
    locationDetails: {
      state: "Himachal Pradesh",
      city: "Manali",
    },
    duration: "1 to 2",
    bestMonth: "January, 2025",
  },
  {
    name: "Andaman Beach Getaway",
    locationDetails: {
      state: "Andaman and Nicobar Islands",
      city: "Port Blair",
    },
    duration: "3 to 4",
    bestMonth: "February, 2024",
  },
  {
    name: "Goa Party Paradise",
    locationDetails: {
      state: "Goa",
      city: "Panaji",
    },
    duration: "2 to 3",
    bestMonth: "December, 2024",
  },
];
const reviews = [
  {
    id: 1,
    name: "Amit Prag",
    location: "Bangalore",
    title: "Trip was very good",
    description: "Cab driver was very good. Taken to all feasible places.",
    destination: "Travelled to Mysore - Coorg",
    date: "2024-11-21",
    rating: 5,
  },
  {
    id: 2,
    name: "Bhaskar Rao",
    location: "Hyderabad",
    title: "Wonderful Experience",
    description: "Well-managed trip with great support.",
    destination: "Travelled to Hyderabad",
    date: "2024-11-21",
    rating: 4,
  },
  {
    id: 2,
    name: "Bhaskar Rao",
    location: "Hyderabad",
    title: "Wonderful Experience",
    description: "Well-managed trip with great support.",
    destination: "Travelled to Hyderabad",
    date: "2024-11-21",
    rating: 4,
  },
  {
    id: 2,
    name: "Bhaskar Rao",
    location: "Hyderabad",
    title: "Wonderful Experience",
    description: "Well-managed trip with great support.",
    destination: "Travelled to Hyderabad",
    date: "2024-11-21",
    rating: 4,
  }
];
const Home = () => {
  const navigate=useNavigate();
  const secretKey = "userData";

  useEffect(() => {
    const token = sessionStorage.getItem(secretKey);

    if (!token) {
      console.log("No token found. Redirecting to Sign In...");
      navigate("/signIn");
      return;
    }

    // Decode the token
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);

      // Check if token has expired
      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token has expired. Redirecting to Sign In...");
        sessionStorage.removeItem(secretKey);
        navigate("/signIn");
        return;
      }
    } catch (error) {
      console.error("Error decoding token:", error.message);
      navigate("/signIn");
    }
  }, []);
  const fetchHomeData = async () => {
    try {
      const baseurl = import.meta.env.VITE_BASE_URL; // Replace with your base URL
      const [packagesResponse, reviewsResponse] = await Promise.all([
        axios.get(`${baseurl}/packages`), // API endpoint for packages
        axios.get(`${baseurl}/reviews`), // API endpoint for reviews
      ]);

      setPackages(packagesResponse.data); // Set fetched packages
      setReviews(reviewsResponse.data.reviews); // Set fetched reviews
    } catch (error) {
      console.error("Error fetching home page data:", error.message);
    }
  };
  // Extract unique destinations, durations, and months
  const destinations = packages.map((pkg) => `${pkg.locationDetails.state}`);
  const durations = [...new Set(packages.map((pkg) => pkg.duration))];
  const bestMonths = [...new Set(packages.map((pkg) => pkg.bestMonth))];

  return (
    <div>
      <div className="app-container">
        <div className="container-fluid hero-section d-flex flex-column text-white position-relative">
          <div className="row align-items-center justify-content-center">
            {/* Left-side image */}
            <div className="col-lg-3 d-none d-lg-block">
              <img
                src={leftImage}
                alt="Left Illustration"
                className="img-fluid left-image"
              />
            </div>

            {/* Main Content */}
            <div className="col-12 col-lg-6 px-3 px-md-5 text-content">
              <h1 className="display-5 fw-bold text-dark text-center text-lg-center">
                Customize & Book <br /> Amazing Holiday Packages
              </h1>
              <p className="lead text-dark text-center text-lg-center">
                650+ Travel Agents serving 65+ Destinations worldwide
              </p>
              <div className="row g-2 d-flex flex-wrap justify-content-center align-items-center mt-4 w-100">
                {/* Destination Dropdown */}
                <div className="position-relative col-12 col-md-3 d-flex justify-content-center align-content-center">
                  {/* Dropdown */}
                  <select
                    className="form-select form-select-lg ps-5"
                    aria-label="Select Destination"
                    style={{ position: "relative" }}
                  >
                    <option defaultValue>Type a Destination</option>
                    {destinations.map((destination, index) => (
                      <option key={index} value={destination}>
                        {destination}
                      </option>
                    ))}
                  </select>

                  {/* Location Icon */}
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="position-absolute"
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "1.2rem",
                      color: "#ef156c",
                    }}
                  />
                </div>

                {/* Duration Dropdown */}
                <div className="col-12 col-md-3 d-flex justify-content-center align-content-center position-relative">
                  <select
                    className="form-select form-select-lg ps-5"
                    aria-label="Select Duration"
                    style={{ position: "relative" }}
                  >
                    <option defaultValue>Select Duration</option>
                    {durations.map((duration, index) => (
                      <option key={index} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                  <FontAwesomeIcon
                    icon={faClock}
                    className="position-absolute "
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#ef156c",
                    }}
                  />
                </div>

                {/* Best Month Dropdown */}
                <div className="col-12 col-md-3 d-flex justify-content-center align-content-center position-relative">
                  <select
                    className="form-select form-select-lg ps-5"
                    aria-label="Select Month"
                    style={{ position: "relative" }}
                  >
                    <option defaultValue>Select Month</option>
                    {bestMonths.map((month, index) => (
                      <option key={index} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="position-absolute"
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#ef156c",
                    }}
                  />
                </div>

                {/* Explore Button */}
                <div className="col-12 col-md-3 d-flex justify-content-center align-content-center">
                  <button
                    className="btn fw-bold w-100 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#ef156c",
                      color: "white",
                      padding: "12px",
                    }}
                  >
                    <FontAwesomeIcon icon={faSearch} className="me-2" />
                    Explore
                  </button>
                </div>
              </div>

              <p className="mt-3 text-dark">
                Destination not sure?{" "}
                <a href="#" className="text-decoration-none text-dark fw-bold">
                  Click here!
                </a>
              </p>
            </div>

            {/* Right-side image */}
            <div className="col-lg-3 d-none d-lg-block">
              <img
                src={rightImage}
                alt="Right Illustration"
                className="img-fluid right-image"
              />
            </div>
          </div>
          <Review />
        </div>
      </div>
    </div>
  );
};

export default Home;
