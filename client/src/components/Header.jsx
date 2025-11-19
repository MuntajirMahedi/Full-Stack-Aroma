import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Header({ user, isAdmin, onLogout, cartCount }) {
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Could not load categories", err.message);
      }
    };
    load();
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const closeProfile = () => setProfileOpen(false);

  return (
    <header className="site-header shadow-sm">
      <div className="container header-inner">

        {/* LOGO */}
        <Link to="/" className="logo">Aroma</Link>

        {/* MOBILE MENU ICON */}
        <div className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* NAVIGATION */}
        <nav className={`nav ${menuOpen ? "open" : ""}`}>

          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/products" onClick={closeMenu}>All Products</Link>

          {/* Categories Dropdown */}
          <div className="categories-dropdown">
            <span className="dropdown-toggle">Categories ▾</span>
            <div className="dropdown-content">
              {categories.map((cat) => (
                <Link
                  key={cat._id || cat.slug || cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  onClick={closeMenu}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* USER PROFILE DROPDOWN */}
          {user && (
            <div className="profile-dropdown">
              <span
                className="profile-toggle"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                Hi, {user.name} ▾
              </span>

              {profileOpen && (
                <div className="profile-menu">
                  <Link
                    to="/profile"
                    onClick={() => { closeProfile(); closeMenu(); }}
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/orders"
                    onClick={() => { closeProfile(); closeMenu(); }}
                  >
                    Orders
                  </Link>

                  <button
                    className="logout-btn"
                    onClick={() => {
                      closeProfile();
                      onLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <Link to="/admin/categories" onClick={closeMenu}>Admin</Link>
          )}

          {!user && <Link to="/login" onClick={closeMenu}>Login</Link>}
          {!user && <Link to="/register" onClick={closeMenu}>Register</Link>}

          {/* CART */}
          {user && (
            <Link to="/cart" className="cart-link" onClick={closeMenu}>
              🛒
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
          )}

        </nav>
      </div>
    </header>
  );
}
