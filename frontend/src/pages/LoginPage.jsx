import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginData = { email, password };

      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
       const userData = await response.json();

    // Store user data (including name)
    localStorage.setItem("user", JSON.stringify({
      name: userData.name,
      email: userData.email,
      role: userData.role
    }));


      if (!response.ok) {
        const resData = await response.json();
        setError(resData.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

  

      if (!userData.token) {
        setError("Login failed: No token received.");
        setLoading(false);
        return;
      }

      // Store token
      localStorage.setItem("token", userData.token);


      // Store user info excluding token
const { token, ...userWithoutToken } = userData;
localStorage.setItem("user", JSON.stringify(userWithoutToken));

      // Determine user role (case-insensitive)
      const role = (userData.role || "").toLowerCase();

      if (role === "lender") {
        navigate("/lender-dashboard");
      } else if (role === "borrower") {
        navigate("/borrower-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        "Network error. Please check if the backend server is running on http://localhost:8080"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {successMessage && (
        <div
          className="success-message"
          style={{
            backgroundColor: "#d4edda",
            color: "#155724",
            padding: "12px",
            borderRadius: "4px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          {successMessage}
        </div>
      )}
      <div className="login-card">
        <h2>Login to AarthaSathi</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email-input">Email</label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password-input">Password</label>
            <div className="password-input-container">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "👁" : "👁‍🗨"}
              </button>
            </div>
          </div>
          {error && (
            <div style={{ color: "red", marginBottom: 8, fontSize: "14px" }}>
              {error}
            </div>
          )}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Signup Options */}
      <div className="signup-options">
        <h3>New to AarthaSathi?</h3>
        <p>Choose how you want to participate:</p>
        <div className="signup-buttons">
          <Link to="/lend" className="signup-option lender-option">
            <div className="option-icon">💰</div>
            <div className="option-content">
              <h4>Become a Lender</h4>
              <p>Support women entrepreneurs by providing microloans</p>
            </div>
          </Link>
          <Link to="/borrow" className="signup-option borrower-option">
            <div className="option-icon">🤝</div>
            <div className="option-content">
              <h4>Apply for a Loan</h4>
              <p>Get financial support for your business or personal needs</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;