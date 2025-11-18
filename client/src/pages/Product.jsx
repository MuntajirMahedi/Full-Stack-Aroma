import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { API_BASE } from "../api";
import Toast from "../components/Toast";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImg, setActiveImg] = useState(null);
  const [toast, setToast] = useState(""); // ⭐ Toast State

  // LOAD PRODUCT
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data);

        if (res.data.images?.length > 0) {
          const url = res.data.images[0].url;
          setActiveImg(
            url.startsWith("http")
              ? url
              : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`
          );
        }
      } catch (err) {
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ADD TO CART
  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      await api.post("/api/cart", { product: product._id, quantity: 1 });

      window.dispatchEvent(new Event("cartChange"));

      // ⭐ Show Toast
      setToast("Added to cart!");
      setTimeout(() => setToast(""), 3000);

    } catch (err) {
      setToast(err.response?.data?.msg || err.message);
      setTimeout(() => setToast(""), 3000);
    }
  };

  // BUY NOW
  const buyNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      await api.post("/api/cart", { product: product._id, quantity: 1 });

      // ⭐ Toast before redirect
      setToast("Redirecting to Orders...");
      setTimeout(() => setToast(""), 2000);

      navigate("/orders");

    } catch (err) {
      setToast(err.response?.data?.msg || err.message);
      setTimeout(() => setToast(""), 3000);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="product-detail-page">

      {/* ⭐ Toast Component */}
      <Toast message={toast} />

      <div className="product-detail-box">

        {/* LEFT IMAGES */}
        <div className="product-images">
          <div className="main-image">
            <img src={activeImg} alt={product.title} />
          </div>

          <div className="thumb-row">
            {product.images?.map((img, i) => {
              const url = img.url.startsWith("http")
                ? img.url
                : `${API_BASE}${img.url.startsWith("/") ? "" : "/"}${img.url}`;

              return (
                <img
                  key={i}
                  src={url}
                  className={activeImg === url ? "thumb active" : "thumb"}
                  onClick={() => setActiveImg(url)}
                  alt="thumb"
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT INFO */}
        <div className="product-info-box">
          <h1>{product.title}</h1>

          <div className="product-meta">
            <span className="brand">{product.brand}</span>
            <span className="price">₹{product.price}</span>
          </div>

          <p className="desc">{product.description}</p>

          <div className="btn-row">
            <button className="add-btn-et single-add-btn" onClick={addToCart}>
              Add to Cart
            </button>

            <button className="btn-et single-view-btn" onClick={buyNow}>
              Buy Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
