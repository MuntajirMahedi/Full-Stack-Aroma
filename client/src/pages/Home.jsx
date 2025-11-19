import React, { useEffect, useState } from "react";
import api, { API_BASE } from "../api";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
// import staricon from '/src/assets/icons/star.png';
// import staricone from '/src/assets/icons/logo.png';



export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState(""); // ⭐ Toast state

  // ⭐ ADD TO CART FUNCTION
  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      await api.post("/api/cart", { product: productId, quantity: 1 });
      window.dispatchEvent(new Event("cartChange"));

      // ⭐ Beautiful toast instead of alert
      setToast("Added to cart!");
      setTimeout(() => setToast(""), 3000);
    } catch (err) {
      setToast(err.response?.data?.msg || err.message);
      setTimeout(() => setToast(""), 3000);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const p = await api.get("/api/products");
        setProducts((p.data || []).slice(0, 6));
      } catch {}

      try {
        const c = await api.get("/api/categories");
        setCategories(c.data || []);
      } catch {}
    };
    load();
  }, []);

  return (
    <div>

      {/* ⭐ Toast Component */}
      <Toast message={toast} />

      {/* === NEW MODERN HERO SECTION === */}
<section className="hero-v2">
  <div className="container hero-v2-inner">

    {/* LEFT CONTENT */}
    <div className="hero-v2-left">
      <div className="hero-badge">
        {/* <img src="../src/assets/hot-sale.png" alt="" /> */}
        Hot Deal In This Week
      </div>

      <h1 className="hero-title">Roco Wireless Headphone</h1>

      <div className="hero-rating">
        <Link to="/products" className="hero-btn">Shop Now</Link>

        <div className="rating-box">
          {/* <img src="" alt="" /> */}
          
          <span>⭐⭐⭐⭐⭐<br/>
          100+ Reviews</span>
        </div>
      </div>
    </div>

    {/* RIGHT PRODUCT IMAGE */}
    <div className="hero-v2-right">
      <img 
        src="https://new.axilthemes.com/demo/template/etrade/assets/images/product/product-38.png" 
        alt="Main Product" 
        className="hero-main-img" 
      />

      {/* Bubble Price Badge */}
      <div className="price-badge">
        From <span>₹499.00</span>
      </div>

      {/* Floating mini image */}
      <img 
        src="https://new.axilthemes.com/demo/template/etrade/assets/images/product/product-39.png" 
        alt="" 
        className="hero-mini-img" 
      />
    </div>

  </div>
</section>


      {/* === WHY CHOOSE US (New Modern Design) === */}
<section className="why-v2">
  <div className="container">

    <div className="why-tag">
      {/* <img src="/src/assets/icons/why.svg" alt="" /> */}
      Why Us
    </div>

    <h2 className="why-title">Why People Choose Aroma</h2>

    <div className="why-grid">

      <div className="why-card">
        <img src="https://new.axilthemes.com/demo/template/etrade/assets/images/icons/service6.png" alt="" className="why-icon" />
        <h4>Fast & Secure Delivery</h4>
      </div>

      <div className="why-card">
        <img src="https://new.axilthemes.com/demo/template/etrade/assets/images/icons/service7.png" alt="" className="why-icon" />
        <h4>100% Guarantee On Product</h4>
      </div>

      <div className="why-card">
        <img src="https://new.axilthemes.com/demo/template/etrade/assets/images/icons/service8.png" alt="" className="why-icon" />
        <h4>24 Hour Return Policy</h4>
      </div>

      <div className="why-card">
        <img src="https://new.axilthemes.com/demo/template/etrade/assets/images/icons/service9.png" alt="" className="why-icon" />
        <h4>24 Hour Return Policy</h4>
      </div>

      <div className="why-card">
        <img src="https://new.axilthemes.com/demo/template/etrade/assets/images/icons/service10.png" alt="" className="why-icon" />
        <h4>Next Level Pro Quality</h4>
      </div>

    </div>

  </div>
</section>






{/* === CATEGORY SECTION (Browse by Category) === */}
<section className="category-section">
  <div className="container">

    <div className="cat-head">
      <span className="cat-tag">Categories</span>
      <h2 className="cat-title">Browse by Category</h2>
    </div>

    <div className="cat-grid">

      {/* Laptop */}
      <Link to="/products?category=Laptop" className="cat-card">
        <div className="cat-icon-box">
          <img
            src="/categories/Categories-Laptop.jpg"
            alt="Laptop"
            className="cat-icon"
          />
        </div>
        <p className="cat-name">Laptop</p>
      </Link>

      {/* AC */}
      <Link to="/products?category=Air Conditioners" className="cat-card">
        <div className="cat-icon-box">
          <img
            src="/categories/Categories-Air-Conditioners.jpg"
            alt="AC"
            className="cat-icon"
          />
        </div>
        <p className="cat-name">Air Conditioners</p>
      </Link>

      {/* Desktops */}
      <Link to="/products?category=Desktops" className="cat-card">
        <div className="cat-icon-box">
          <img
            src="/categories/Categories-Desktops.jpg"
            alt="Desktops"
            className="cat-icon"
          />
        </div>
        <p className="cat-name">Desktops</p>
      </Link>

      {/* Accessories */}
      <Link to="/products?category=Accessories" className="cat-card">
        <div className="cat-icon-box">
          <img
            src="/categories/Categories-Accessories.jpg"
            alt="Accessories"
            className="cat-icon"
          />
        </div>
        <p className="cat-name">Accessories</p>
      </Link>

      {/* LED TVs */}
      <Link to="/products?category=LED TVs" className="cat-card">
        <div className="cat-icon-box">
          <img
            src="/categories/Categories-LED-TVs.jpeg"
            alt="LED TVs"
            className="cat-icon"
          />
        </div>
        <p className="cat-name">LED TVs</p>
      </Link>

    </div>

  </div>
</section>









{/* === PROMO BANNERS SECTION === */}
<section className="promo-section">
  <div className="container promo-grid">

    {/* LEFT BIG PROMO CARD */}
    <div className="promo-card left-promo">
      <img 
        src="https://new.axilthemes.com/demo/template/etrade/assets/images/product/poster/poster-01.png" 
        alt="Promo Left" 
        className="promo-img"
      />

      <div className="promo-content">
        <h3>Rich sound, for less.</h3>
        <a href="/products" className="promo-link">Collections →</a>
        {/* <Link to="/products" className="hero-btn">Shop Now</Link> */}
      </div>
    </div>

    {/* RIGHT BIG PROMO CARD */}
    <div className="promo-card right-promo">
      <img 
        src="https://new.axilthemes.com/demo/template/etrade/assets/images/product/poster/poster-02.png" 
        alt="Promo Right" 
        className="promo-img"
      />

      <div className="promo-content">
        <span className="offer-tag">50% Offer In Winter</span>
        <h3>Get VR Reality Glass</h3>
        <a href="/products" className="promo-link">Collections →</a>
      </div>
    </div>

  </div>
</section>



      {/* === MOST SOLD / FEATURED PRODUCTS === */}
<section className="featured-v2">
  <div className="container">

    <h2 className="featured-title">Most Sold in Aroma Store</h2>

    {/* Section Tag */}
    <div className="featured-tag">
      {/* <img src="/src/assets/icons/mostsold.svg" alt="" /> */}
      Most Sold
    </div>

    <div className="featured-list">
      {products.map((p) => {
        let mainImg = null;
        let thumbnails = [];

        if (p.images?.length > 0) {
          thumbnails = p.images;
          const u = thumbnails[0].url;
          mainImg = u.startsWith("http")
            ? u
            : `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`;
        }

        return (
          <Link
            to={`/products/${p._id}`}
            key={p._id}
            className="featured-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >

            {/* LEFT IMAGE */}
            <div className="featured-left">
              <img
                src={mainImg}
                alt={p.title}
                className="featured-main-img"
              />

              {/* Thumbnails */}
              <div className="featured-thumbs">
                {thumbnails.map((imgObj, i) => {
                  const t = imgObj.url.startsWith("http")
                    ? imgObj.url
                    : `${API_BASE}${imgObj.url.startsWith("/") ? "" : "/"}${imgObj.url}`;

                  return (
                    <img
                      key={i}
                      src={t}
                      className="thumb-img"
                    />
                  );
                })}
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="featured-right">

              {/* Rating */}
              <div className="rating-box">
                ⭐⭐⭐⭐⭐&nbsp;
                <span className="reviews">{p.reviews || "50+"} Reviews</span>
              </div>

              {/* Title */}
              <h3 className="featured-name">{p.title}</h3>

              {/* Price */}
              <div className="price-box">
                <span className="new-price">₹{p.price}</span>
                {p.oldPrice && (
                  <span className="old-price">₹{p.oldPrice}</span>
                )}
              </div>

              {/* Actions */}
              <div className="featured-actions">
                <button 
                  className="ico-btn"
                  onClick={(e) => {
                    e.preventDefault(); // ❗ Card link ko rukne se bachata hai
                    addToCart(p._id);
                  }}
                >
                  Add to cart 🛒
                </button>
              </div>
            </div>

          </Link>
        );
      })}
    </div>

  </div>
</section>




      

      {/* === TESTIMONIALS V2 (eTrade Style) === */}
<section className="testimonial-v2">
  <div className="container">

    {/* Heading */}
    <div className="t-head">
      <div className="t-tag">
        {/* <img src="/src/assets/icons/testimonial.svg" alt="" /> */}
        Testimonials
      </div>
      <h2 className="t-title">Users Feedback</h2>
    </div>

    <div className="t-slider">

      {/* Testimonial 1 */}
      <div className="t-card">
        <p className="t-text">
          “ It’s amazing how much easier it has been to meet new people and create instantly 
          non connections. I have the exact same personal the only thing that has changed 
          is my mind set and a few behaviors. “
        </p>

        <div className="t-author">
          <img src="https://new.axilthemes.com/demo/template/etrade/assets/images/testimonial/image-1.png" className="t-avatar" />
          <div>
            <div className="t-role">Head Of Idea</div>
            <div className="t-name">James C. Anderson</div>
          </div>
        </div>
      </div>

      {/* Testimonial 2 */}
      <div className="t-card">
        <p className="t-text">
          “ It’s amazing how much easier it has been to meet new people and create instantly 
          non connections. I have the exact same personal the only thing that has changed 
          is my mind set and a few behaviors. “
        </p>

        <div className="t-author">
          <img src="https://new.axilthemes.com/demo/template/etrade/assets/images/testimonial/image-2.png" className="t-avatar" />
          <div>
            <div className="t-role">Head Of Idea</div>
            <div className="t-name">James C. Anderson</div>
          </div>
        </div>
      </div>

      {/* Testimonial 3 */}
      <div className="t-card">
        <p className="t-text">
          “ It’s amazing how much easier it has been to meet new people and create instantly 
          non connections. I have the exact same personal the only thing that has changed 
          is my mind set and a few behaviors. “
        </p>

        <div className="t-author">
          <img src="https://new.axilthemes.com/demo/template/etrade/assets/images/testimonial/image-3.png" className="t-avatar" />
          <div>
            <div className="t-role">Head Of Idea</div>
            <div className="t-name">James C. Anderson</div>
          </div>
        </div>
      </div>
      

    </div>

    {/* Arrows */}
    {/* <div className="t-arrows">
      <button className="arrow-btn">←</button>
      <button className="arrow-btn">→</button>
    </div> */}

  </div>
</section>






      {/* === NEWSLETTER CTA (eTrade Style) === */}
<section className="newsletter-section">
  <div className="container newsletter-box">

    {/* LEFT */}
    <div className="newsletter-left">
      <div className="news-tag">
        {/* <img src="/src/assets/icons/mail.svg" alt="" /> */}
        Newsletter
      </div>

      <h2 className="news-title">Get weekly update</h2>

      <Link to="/products" className="hero-btn">Shop Now</Link>

      {/* <div className="news-form">
        <input 
          type="email" 
          placeholder="example@gmail.com" 
          className="news-input"
        />
        <button className="news-btn">Subscribe</button>
      </div> */}
    </div>

    {/* RIGHT IMAGE */}
    <div className="newsletter-right">
      <img 
        src="https://new.axilthemes.com/demo/template/etrade/assets/images/product/poster/poster-03.png" 
        alt="Newsletter Banner" 
        className="newsletter-img" 
      />
    </div>

  </div>
</section>


    </div>
  );
}
