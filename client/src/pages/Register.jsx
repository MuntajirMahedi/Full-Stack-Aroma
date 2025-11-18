import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 VALIDATION FUNCTION
  const validate = () => {
    let newErrors = {};

    // Name validation
    if (!name.trim()) newErrors.name = "Full name is required.";
    else if (name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters.";

              // STRICT GMAIL VALIDATION
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@email\.com$/;

      if (!email.trim()) newErrors.email = "Email is required.";
      else if (!gmailRegex.test(email) && !emailRegex.test(email)) 
        newErrors.email = "Email must be a valid gmail.com or email.com addressy.";



    // Password validation
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!password.trim()) newErrors.password = "Password is required.";
    else if (!passRegex.test(password))
      newErrors.password =
        "Password must contain 6+ chars, uppercase, lowercase & number.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError(null);
    setSuccess(null);

    if (!validate()) return;

    setLoading(true);

    try {
      await api.post("/api/auth/register", { name, email, password });

      setSuccess("✓ Registration successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setServerError(err.response?.data?.msg || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-page">
      <div className="container">
        <div className="register-card">
          <h2>Create an Account 🚀</h2>
          <p className="muted">Join Aroma to access exclusive offers.</p>

          {/* SERVER ERROR */}
          {serverError && (
            <div className="alert error">
              <strong>✗</strong> {serverError}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="alert success">
              <strong>✓</strong> {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* NAME */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className={errors.email ? "input-error" : ""}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            {/* PASSWORD */}
            <div className="form-group">
              <label>Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className={errors.password ? "input-error" : ""}
              />
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}
            </div>

            {/* BUTTON */}
            <button type="submit" className="btn btn-primary full" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="muted small-text">
              Already have an account?{" "}
              <a href="/login" className="link">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
