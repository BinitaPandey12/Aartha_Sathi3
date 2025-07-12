import React, { useState } from "react";
import "./LenderSignup.css";
import { useNavigate } from "react-router-dom";

const LenderSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    idNumber: "",
    idPhoto: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (name === "email") setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.endsWith("@gmail.com")) {
      setError("Email must be a @gmail.com address");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("address", formData.address);
      data.append("idNumber", formData.idNumber);
      data.append("file", formData.idPhoto);

      const response = await fetch(
        "http://localhost:8080/api/auth/signup/lender",
        {
          method: "POST",
          body: data,
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || "Signup failed. Please try again.");
        setLoading(false);
        return;
      }
      
      setShowSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Lender account created successfully! Please login to continue.",
            userType: "lender",
          },
        });
      }, 2000);
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        "Network error. Please check if the backend server is running on http://localhost:8080"
      );
      setLoading(false);
    }
  };

  return (
    <div className="lender-signup-container">
      {showSuccess && (
        <div className="success-popup">
          <div className="success-content">
            <h3>Signup Successful!</h3>
            <p>Your lender account has been created successfully.</p>
            <p>Redirecting to login...</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="lender-signup-form">
        <h2>Become a Lender</h2>
        <p className="form-subtitle">
          Join AarthaSathi to empower women through microloans
        </p>

        <div className="form-section">
          <h3>Personal Information</h3>

          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          {error && (
            <div style={{ color: "red", marginBottom: 8, fontSize: "14px" }}>
              {error}
            </div>
          )}

          <textarea
            name="address"
            placeholder="Full Address"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="idNumber"
            placeholder="Government ID Number"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-section">
          <h3>Government Photo</h3>
          <div className="file-uploads">
            <label>
              Upload Government Photo:
              <input
                type="file"
                name="idPhoto"
                onChange={handleChange}
                accept=".jpg,.png,.pdf"
                required
              />
            </label>
          </div>
        </div>

        <div className="terms-checkbox">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms" className="checkbox-label">
            I agree to the <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>
          </label>
        </div>

        <button className="create-account-btn" disabled={loading}>
          {loading ? "Signing up..." : "Create Lender Account"}
        </button>

        <p className="login-redirect">
          Have an Account?{" "}
          <span onClick={() => navigate("/login")}>Login Here</span>
        </p>
      </form>
    </div>
  );
};

export default LenderSignup;
