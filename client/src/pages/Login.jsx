import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({}); // ⭐ field-wise errors

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    // ⭐ FRONTEND VALIDATION
    const newErr = {};

    if (!email.trim()) newErr.email = "Email is required";
    if (!password.trim()) newErr.password = "Password is required";

    if (Object.keys(newErr).length > 0) {
      setFieldErrors(newErr);
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/auth/login", { email, password });
      const token = res.data?.token;

      if (token) {
        localStorage.setItem("token", token);
        setSuccess("✓ Login successful! Redirecting...");

        setTimeout(() => {
          window.dispatchEvent(new Event("authChange"));
          navigate("/");
        }, 1200);
      } else {
        setError("No token received from server");
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <div className="container">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <p className="muted">Please sign in to your Aroma account</p>

          {/* TOP ERRORS */}
          {error && (
            <div className="alert error">
              <strong>✗</strong> {error}
            </div>
          )}
          {success && (
            <div className="alert success">
              <strong>✓</strong> {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                className={fieldErrors.email ? "input-error" : ""}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
              />
              {fieldErrors.email && (
                <p className="error-text">{fieldErrors.email}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>
              <input
                className={fieldErrors.password ? "input-error" : ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
              />
              {fieldErrors.password && (
                <p className="error-text">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="muted small-text">
              Don’t have an account?{" "}
              <a href="/register" className="link">Register here</a>
            </p>
          </form>

        </div>
      </div>
    </section>
  );
}
