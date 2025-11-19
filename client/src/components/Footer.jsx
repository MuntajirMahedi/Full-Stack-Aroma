import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo" aria-labelledby="footer-heading">
      <div className="container footer-inner">
        {/* Column 1 - About */}
        <div className="footer-col">
          <h4 id="footer-heading">Aroma</h4>
          <p className="muted">
            Aroma is your trusted online destination for high-quality auto parts.
            We deliver reliability, value and quick support for every customer.
          </p>
        </div>

        {/* Column 2 - Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Column 3 - Contact Info */}
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>📍 123 Auto Street, Dubai, UAE</li>
            <li>📧 <a href="mailto:support@aroma.com">support@aroma.com</a></li>
            <li>📞 <a href="tel:+971123456789">+971 123 456 789</a></li>
          </ul>

          {/* <div className="social-links" aria-hidden="true">
            <a href="#" aria-label="Facebook" className="social-btn">f</a>
            <a href="#" aria-label="Twitter" className="social-btn">t</a>
            <a href="#" aria-label="Instagram" className="social-btn">i</a>
          </div> */}
        </div>
      </div>

      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} Aroma. All rights reserved.</div>
        <div className="credit">Built with <span aria-hidden="true"></span> by <strong>Mahedi</strong></div>
      </div>
    </footer>
  );
}
