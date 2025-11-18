import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      const token = res.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        setSuccess("✓ Login successful! Redirecting...");
        setTimeout(() => {
          window.dispatchEvent(new Event("authChange"));
          navigate("/");
        }, 1500);
      } else {
        setError("No token received from server");
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  const showToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      alert(`✓ Token found:\n\n${token}`);
    } else {
      alert("✗ No token in localStorage");
    }
  };

  return (
    <section className="login-page">
      <div className="container">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>
          <p className="muted">Please sign in to your Aroma account</p>

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
            <div className="form-group">
              <label>Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* <button
              type="button"
              onClick={showToken}
              className="btn btn-ghost full"
            >
              Show Token
            </button> */}

            <p className="muted small-text">
              Don’t have an account?{" "}
              <a href="/register" className="link">
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
