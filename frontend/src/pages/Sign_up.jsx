import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import sign_up_bg from "../images/sign-up-bg.jpg";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { TextField, Button, Box, Grid, Typography } from "@mui/material";
import axios from "axios";

const Sign_up = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "", visible: false }); // State for alert
  const navigate = useNavigate();

  // Validation functions
  const validateFullName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validateMobileNumber = (number) => /^[0-9]{10}$/.test(number);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    switch (name) {
      case "username":
        setErrors((prev) => ({
          ...prev,
          username: validateFullName(value)
            ? ""
            : "Full Name should contain only alphabets.",
        }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          email: validateEmail(value) ? "" : "Enter a valid email address.",
        }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(value)
            ? ""
            : "Password should be at least 6 characters.",
        }));
        break;
      case "phoneNumber":
        setErrors((prev) => ({
          ...prev,
          phoneNumber: validateMobileNumber(value)
            ? ""
            : "Mobile Number must be exactly 10 digits.",
        }));
        break;
      case "confirmPassword":
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            value !== formData.password ? "Passwords do not match" : "",
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check all validations before submission
    if (
      !validateFullName(formData.username) ||
      !validateEmail(formData.email) ||
      !validatePassword(formData.password) ||
      !validateMobileNumber(formData.phoneNumber) ||
      formData.password !== formData.confirmPassword
    ) {
      setAlert({
        message: "Please fix the validation errors.",
        type: "danger",
        visible: true,
      });
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${baseUrl}/users/register`, formData);
      console.log("Success:", response.data);

      setAlert({
        message: "Signup successful! Redirecting to Sign In...",
        type: "success",
        visible: true,
      });

      setFormData({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/sign_in");
      }, 2000); // Navigate to Sign In after 2 seconds
    } catch (error) {
      console.error("Error:", error);
      setAlert({
        message: "Something went wrong! Please try again.",
        type: "danger",
        visible: true,
      });
    }
  };

  const closeAlert = () => setAlert({ ...alert, visible: false });

  const isFormValid =
    validateFullName(formData.username) &&
    validateEmail(formData.email) &&
    validatePassword(formData.password) &&
    validateMobileNumber(formData.phoneNumber) &&
    formData.password === formData.confirmPassword;

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      {/* Alert Box */}
      {alert.visible && (
        <div
          className={`alert alert-${alert.type} position-fixed top-0 end-0 m-3`}
          role="alert"
          style={{ zIndex: 1050, width: "300px" }}
        >
          {alert.message}
          <button
            type="button"
            className="btn-close ms-2"
            aria-label="Close"
            onClick={closeAlert}
          ></button>
        </div>
      )}

      <Grid
        container
        spacing={2}
        sx={{ padding: 4, borderRadius: 2, boxShadow: 3 }}
      >
        {/* Left Column - Sign-Up Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 3,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
            <Typography variant="h4" className="text-center mb-4" gutterBottom>
              SIGN UP
            </Typography>
            <Button
              variant="contained"
              color="warning"
              fullWidth
              startIcon={<FontAwesomeIcon icon={faGoogle} />}
              sx={{ mb: 2 }}
            >
              Sign Up with Google
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<FontAwesomeIcon icon={faFacebook} />}
              sx={{ mb: 4 }}
            >
              Sign Up with Facebook
            </Button>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Full Name Field */}
                <TextField
                  label="User Name"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.username}
                  helperText={errors.username}
                />

                {/* Email Field */}
                <TextField
                  label="Email ID"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />

                {/* Password Field */}
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.password}
                  helperText={errors.password}
                />

                {/* Confirm Password Field */}
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />

                {/* Mobile Number Field */}
                <TextField
                  label="Mobile Number"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!isFormValid}
                  sx={{
                    backgroundColor: "rgba(40, 41, 65, 1)",
                    color: "white",
                    mt: 2,
                    "&:disabled": {
                      backgroundColor: "#ccc",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>

        {/* Right Column - Image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={sign_up_bg}
            alt="Signup Visual"
            className="img-fluid rounded"
            sx={{
              // zIndex: -1,
              width: "100%",
              height: "90vh",
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: 20,
              color: "white",
              zIndex: 1,
            }}
          >
            <Typography variant="h3" gutterBottom>
              Welcome to Sign_Up
            </Typography>
            <Typography variant="body1">
              Already have an account?{" "}
              <Link to="/sign_in" style={{ color: "white" }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sign_up;
