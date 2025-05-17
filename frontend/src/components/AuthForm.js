import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  Alert,
  MenuItem,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  isValidEmail,
  isValidPassword,
  isValidMobile,
  sanitizeText,
} from "../utils/validation";

const AuthForm = ({ type, icon: Icon }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [formData, setFormData] = useState(
    type === "login"
      ? { email: "", password: "" }
      : {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          mobile: "",
          gender: "",
        }
  );
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    // Email validation
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (type === "login") {
      if (!formData.password) {
        setError("Password is required");
        return false;
      }
      return true;
    }

    if (type === "register") {
      if (!isValidPassword(formData.password)) {
        setError(
          "Password must be at least 8 characters long with at least one number"
        );
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }

      if (!sanitizeText(formData.firstName)) {
        setError("First name is required");
        return false;
      }

      if (!sanitizeText(formData.lastName)) {
        setError("Last name is required");
        return false;
      }

      if (!isValidMobile(formData.mobile)) {
        setError("Please enter a valid phone number (10-12 digits)");
        return false;
      }

      if (!formData.gender) {
        setError("Gender is required");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      if (type === "login") {
        await login({ email: formData.email, password: formData.password });
        navigate("/");
      } else {
        const sanitizedData = {
          ...formData,
          firstName: sanitizeText(formData.firstName),
          lastName: sanitizeText(formData.lastName),
          email: formData.email.trim().toLowerCase(),
          mobile: formData.mobile.replace(/\D/g, ""),
        };

        delete sanitizedData.confirmPassword;
        await register(sanitizedData);
        navigate("/");
      }
    } catch (err) {
      if (err.data && err.data.errors) {
        // Handle validation errors from backend
        const errorMessages = Object.values(err.data.errors).join(", ");
        setError(errorMessages || `Failed to ${type}. Please try again.`);
      } else {
        setError(err.message || `Failed to ${type}. Please try again.`);
      }
      console.error("Auth error:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #23272f 60%, #232b3b 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{ p: 4, borderRadius: 4, boxShadow: 8, mt: 6 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Icon color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography
              variant="h4"
              component="h1"
              align="center"
              gutterBottom
              fontWeight={700}
            >
              {type === "login" ? "Login" : "Register"}
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {type === "register" && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  sx={{ input: { color: "white" } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  sx={{ input: { color: "white" } }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="mobile"
                  label="Phone Number"
                  name="mobile"
                  autoComplete="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  sx={{ input: { color: "white" } }}
                  inputProps={{
                    pattern: "[0-9]*",
                  }}
                  helperText="Enter 10-12 digit phone number (digits only)"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  select
                  id="gender"
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  sx={{ input: { color: "white" } }}
                >
                  {" "}
                  <MenuItem value="male">Male</MenuItem>{" "}
                  <MenuItem value="female">Female</MenuItem>{" "}
                </TextField>
              </>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus={type === "login"}
              value={formData.email}
              onChange={handleChange}
              sx={{ input: { color: "white" } }}
              type="email"
              inputProps={{
                pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
              }}
              helperText="Enter a valid email address"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete={
                type === "login" ? "current-password" : "new-password"
              }
              value={formData.password}
              onChange={handleChange}
              sx={{ input: { color: "white" } }}
              inputProps={{
                minLength: type === "register" ? 8 : undefined,
              }}
              helperText={
                type === "register"
                  ? "Minimum 8 characters with at least one number"
                  : ""
              }
            />
            {type === "register" && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                sx={{ input: { color: "white" } }}
                inputProps={{ minLength: 8 }}
              />
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{
                mt: 3,
                mb: 2,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: 18,
              }}
            >
              {type === "login" ? "Sign In" : "Sign Up"}
            </Button>
            <Box sx={{ textAlign: "center" }}>
              <Link
                component={RouterLink}
                to={type === "login" ? "/register" : "/login"}
                variant="body2"
                color="secondary"
              >
                {type === "login"
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Link>
            </Box>
          </Box>
          {type === "login" && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link component={RouterLink} to="/register" color="secondary">
                  Sign up here
                </Link>
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthForm;
