import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import sign_in from "../images/sign-in.jpg";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Box, Grid, FormHelperText } from "@mui/material";
import axios from "axios";
import { useUser } from "../hooks/UserContext"; // Import the useUser hook

const Sign_in = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });
  const navigate = useNavigate();

  const { login } = useUser(); // Use login function from UserContext

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.trim() !== "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    switch (name) {
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
            : "Password cannot be empty.",
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email) || !validatePassword(formData.password)) {
      setAlert({
        message: "Please fix the validation errors.",
        type: "danger",
        visible: true,
      });
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${baseUrl}/users/login`, formData);
      console.log("Response Data:", response.data);

      // Use login function from context to set user globally
      login(response.data.token);

      setAlert({
        message: "Sign-in successful!",
        type: "success",
        visible: true,
      });

      setTimeout(() => {
        navigate("/"); // Navigate to the home page
      }, 2000);
    } catch (error) {
      console.error("Error during sign-in:", error);
      setAlert({
        message: "Invalid credentials. Please try again.",
        type: "danger",
        visible: true,
      });
    }
  };

  const closeAlert = () => setAlert({ ...alert, visible: false });

  const isFormValid =
    validateEmail(formData.email) && validatePassword(formData.password);

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

      <Grid container spacing={2} className="shadow-lg" sx={{ padding: 4, borderRadius: 2 }}>
        <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Box sx={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
            <h3 className="text-center mb-4">SIGN IN</h3>
            <Button
              variant="contained"
              color="warning"
              fullWidth
              startIcon={<FontAwesomeIcon icon={faGoogle} />}
              sx={{ mb: 2 }}
            >
              Sign In with Google
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<FontAwesomeIcon icon={faFacebook} />}
              sx={{ mb: 4 }}
            >
              Sign In with Facebook
            </Button>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div>
                  <TextField
                    label="Email ID"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  {errors.email && (
                    <FormHelperText error>{errors.email}</FormHelperText>
                  )}
                </div>
                <div>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  {errors.password && (
                    <FormHelperText error>{errors.password}</FormHelperText>
                  )}
                </div>
                <div>
                  <Link to="/forgot_password" className="text-primary">
                    Forgot Password !
                  </Link>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!isFormValid}
                  sx={{
                    backgroundColor: "rgba(40, 41, 65, 1)",
                    color: "white",
                    mt: 2,
                    "&:disabled": { backgroundColor: "#ccc" },
                  }}
                >
                  Sign In
                </Button>
              </Box>
            </form>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ position: "relative" }}>
          <img
            src={sign_in}
            alt="Sign-In Visual"
            className="img-fluid rounded"
            style={{ width: "100%", height: "90vh", objectFit: "cover" }}
          />
          <Box sx={{ position: "absolute", bottom: 20, left: 20, color: "white" }}>
            <h1>Welcome to Sign_In</h1>
            <p>
              Don't have an account?{" "}
              <Link to="/sign_up" style={{ color: "white" }}>
                Sign Up
              </Link>
            </p>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sign_in;
