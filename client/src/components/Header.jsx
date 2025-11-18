import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Header({ user, isAdmin, onLogout, cartCount }) {
  const [categories, setCategories] = useState([]);

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

  return (
    <header className="site-header shadow-sm">
      <div className="container header-inner">

        {/* === Brand === */}
        <div className="brand">
          <Link to="/" className="logo">
            Aroma<span className="logo-dot"></span>
          </Link>
        </div>

        {/* === Navigation === */}
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/products">All Products</Link>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="categories-dropdown">
              <div className="dropdown-content">
                {categories.map((cat) => (
                  <Link
                    key={cat._id || cat.name || Math.random()}
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}


          {/* Orders */}
          {user && <Link to="/orders">Orders</Link>}

          

          {/* Auth */}
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/register">Register</Link>}
          {user && <Link to="/profile">Hi, {user.name}</Link>}

          {isAdmin && <Link to="/admin/categories">Admin</Link>}

          {user && (
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          )}

          {/* Cart with badge */}
          {user && (
            <Link to="/cart" className="cart-link">
              🛒 &nbsp;
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
