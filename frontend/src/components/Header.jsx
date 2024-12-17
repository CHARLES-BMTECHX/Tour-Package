import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faUserCircle,
  faSignOutAlt 
} from "@fortawesome/free-solid-svg-icons";
import logo from "../images/logo.png"; // Replace with your logo path

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = () => setDropdownOpen(true);
  const handleMouseLeave = () => setDropdownOpen(false);

  const destinations = [
    { country: "India", state: "Tamil Nadu", city: "Pondicherry" },
    { country: "India", state: "Kerala", city: "Alleppey" },
    { country: "India", state: "Himachal Pradesh", city: "Shimla" },
    { country: "UAE", state: "Dubai", city: "Dubai" },
    { country: "Singapore", state: "Central Singapore", city: "Singapore" },
    { country: "France", state: "Ile-de-France", city: "Paris" },
  ];
  const domesticDestinations = destinations.filter(
    (dest) => dest.country === "India"
  );
  const internationalDestinations = destinations.filter(
    (dest) => dest.country !== "India"
  );
  return (
    <nav
      className="navbar navbar-expand-lg navbar-light border-bottom"
      style={{
        backgroundColor: "white",
        boxShadow:"rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "150px",
              height: "80px",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>

        {/* Toggler Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto d-flex gap-3">
            {/* Destinations */}
            <li className="nav-item">
              <Link
                className="nav-link text-dark hover-underline"
                to="/destinations"
              >
                Destinations
              </Link>
            </li>

            {/* Tours Dropdown */}
            <li
              className="nav-item dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                className="nav-link dropdown-toggle hover-underline text-dark d-flex align-items-center"
                to="#"
                id="toursDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Tours
                <FontAwesomeIcon
                  icon={isDropdownOpen ? faCaretUp : faCaretDown}
                  className="ms-2"
                />
              </Link>

              {/* Dropdown Menu */}
              <ul
                className={`dropdown-menu ${
                  isDropdownOpen ? "show" : ""
                } p-3 border-0 shadow-lg`}
                aria-labelledby="toursDropdown"
                style={{ minWidth: "250px" }}
              >
                {/* Domestic Packages Section */}
                <li>
                  <h6 className="dropdown-header" style={{color:'rgba(40, 41, 65, 1)'}}>Domestic Packages</h6>
                </li>
                {domesticDestinations.map((dest, index) => (
                  <li key={index}>
                    <Link
                      className="dropdown-item"
                      to={`/family-packages/domestic/${dest.state
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {dest.state} - {dest.city}
                    </Link>
                  </li>
                ))}

                <li>
                  <hr className="dropdown-divider" />
                </li>

                {/* International Packages Section */}
                <li>
                  <h6 className="dropdown-header" style={{color:'rgba(40, 41, 65, 1)'}}>International Packages</h6>
                </li>
                {internationalDestinations.map((dest, index) => (
                  <li key={index}>
                    <Link
                      className="dropdown-item"
                      to={`/family-packages/international/${dest.country
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {dest.country} - {dest.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Gateways */}
            <li className="nav-item">
              <Link
                className="nav-link text-dark hover-underline"
                to="/holiday-packages"
              >
                Gateways
              </Link>
            </li>

            {/* Tour Plans */}
            <li className="nav-item">
              <Link
                className="nav-link text-dark hover-underline"
                to="/holiday-deals"
              >
                Tour Plans
              </Link>
            </li>

            {/* Blogs */}
            <li className="nav-item">
              <Link
                className="nav-link text-dark hover-underline"
                to="/luxury-holidays"
              >
                Blogs
              </Link>
            </li>
            {/* User Profile Icon with Dropdown */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-dark d-flex align-items-center"
                to="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faUserCircle} className="fs-3 me-1" />
                <FontAwesomeIcon icon={faCaretDown} className="ms-2" />
              </Link>

              {/* Dropdown Menu */}
              <ul
                className="dropdown-menu dropdown-menu-end shadow"
                aria-labelledby="userDropdown"
              >
                <li>
                  <Link className="dropdown-item hover-underline" to="/sign_in">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item hover-underline" to="/sign_up">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item hover-underline" to="/profile">
                    My Profile
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link
                    className="dropdown-item text-danger hover-underline d-flex align-items-center"
                    to="/sign_in"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                    Logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
