import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Header({ user, isAdmin, onLogout, cartCount }) {
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header className="site-header shadow-sm">
      <div className="container header-inner">

        {/* LOGO */}
        <Link to="/" className="logo">Aroma</Link>

        {/* MOBILE MENU ICON */}
        <div
          className="mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* NAVIGATION */}
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/products" onClick={closeMenu}>All Products</Link>

          {/* Categories */}
          <div className="categories-dropdown">
            <span className="dropdown-toggle">Categories ▾</span>
            <div className="dropdown-content">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  onClick={closeMenu}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {user && (
            <Link to="/orders" onClick={closeMenu}>Orders</Link>
          )}

          {user && (
            <Link to="/profile" onClick={closeMenu}>
              Hi, {user.name}
            </Link>
          )}

          {isAdmin && (
            <Link to="/admin/categories" onClick={closeMenu}>
              Admin
            </Link>
          )}

          {!user && <Link to="/login" onClick={closeMenu}>Login</Link>}
          {!user && <Link to="/register" onClick={closeMenu}>Register</Link>}

          {user && (
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          )}

          {user && (
            <Link to="/cart" className="cart-link" onClick={closeMenu}>
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}
        </nav>

      </div>
    </header>
  );
}
