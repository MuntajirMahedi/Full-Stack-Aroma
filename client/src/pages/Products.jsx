import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import api, { API_BASE } from '../api'
import Toast from "../components/Toast"

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState("")
  const query = useQuery()

  const category = query.get('category')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        let url = "/api/products"
        if (category) {
          url = `/api/products?category=${encodeURIComponent(category)}`
        }
        const res = await api.get(url)
        setProducts(res.data || [])
      } catch (err) {
        setError(err.response?.data?.msg || err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [category])

  // ⭐ Add to Cart
  const addToCart = async (productId) => {
    const token = localStorage.getItem("token")

    if (!token) {
      window.location.href = "/login"
      return
    }

    try {
      await api.post("/api/cart", { product: productId, quantity: 1 })

      window.dispatchEvent(new Event("cartChange"))

      setToast("Added to cart!")
      setTimeout(() => setToast(""), 3000)

    } catch (err) {
      setToast(err.response?.data?.msg || err.message)
      setTimeout(() => setToast(""), 3000)
    }
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color:'red' }}>Error: {error}</p>

  return (
    <div>

      <Toast message={toast} />

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2>
          Products 
          {category && <span className="muted"> — {category}</span>}
        </h2>

        {category && <Link to="/products" className="btn">View All</Link>}
      </div>

      {/* === PRODUCT GRID === */}
      <div className="grid" style={{ marginTop: 12 }}>
        {products.length === 0 && (
          <div className="card">No products found.</div>
        )}

        {products.map((p) => {
          let mainImg = null
          let thumbnails = []

          if (p.images && p.images.length > 0) {
            thumbnails = p.images
            const u = thumbnails[0].url
            mainImg = u.startsWith("http")
              ? u
              : `${API_BASE}${u.startsWith("/") ? "" : "/"}${u}`
          }

          return (
            <div key={p._id} className="product-card-et">

              {/* === DISCOUNT BADGE === */}
              {p.discount && (
                <span className="badge-off">{p.discount}% OFF</span>
              )}

              {/* === PRODUCT BOX WITH HOVER === */}
              <div className="product-box-et">
                <img 
                  src={mainImg}
                  alt={p.title}
                  className="product-main-img-et"
                  onClick={() => window.location.href = `/products/${p._id}`}
                />

                <div className="hover-actions-et">
                  {/* <button className="icon-btn-et">♡</button> */}

                  <button 
                    className="add-btn-et single-add-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(p._id)
                    }}
                  >
                    Add to Cart
                  </button>

                  <button 
                    className="icon-btn-et"
                    onClick={() => window.location.href = `/products/${p._id}`}
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* === TITLE === */}
              <h3 className="p-title-et">{p.title}</h3>

              {/* === PRICE === */}
              <div className="p-price-row">
                <span className="hero-btn" >₹{p.price}</span>
                {p.oldPrice && <span className="p-old-price">₹{p.oldPrice}</span>}
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
