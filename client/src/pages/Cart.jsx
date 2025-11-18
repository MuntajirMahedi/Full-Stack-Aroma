import React, { useEffect, useState } from "react";
import api, { API_BASE } from "../api";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Shipping address
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");
  const [formError, setFormError] = useState(null);

  /** IMAGE URL FIX */
  const getImageUrl = (product) => {
    if (!product?.images?.length) return "/placeholder.png";
    const url = product.images[0].url || "";
    if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:")) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  /** LOAD CART */
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cart");
      let data = res.data || { items: [] };

      // Populate missing product data
      const populatedItems = await Promise.all(
        data.items.map(async (item) => {
          if (!item.product || typeof item.product === "string") {
            try {
              const p = await api.get(`/api/products/${item.product}`);
              return { ...item, product: p.data };
            } catch {
              return item;
            }
          }
          return item;
        })
      );

      setCart({ ...data, items: populatedItems });
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /** INSTANT REMOVE FIX */
  const remove = async (productId) => {
    try {
      // 1️⃣ UI instantly update
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((it) => it.product._id !== productId),
      }));

      // 2️⃣ API background call
      await api.delete(`/api/cart/${productId}`);

      window.dispatchEvent(new Event("cartChange"));
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    }
  };

  /** INSTANT QTY UPDATE FIX */
  const updateQty = async (itemId, qty) => {
    if (qty < 1) return;

    // 1️⃣ UI instantly update
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it._id === itemId ? { ...it, quantity: qty } : it
      ),
    }));

    // 2️⃣ API background update
    try {
      await api.patch(`/api/cart/${itemId}`, { quantity: qty });
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    }
  };

  if (loading) return <p className="loading">Loading your cart...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  const total = cart.items.reduce(
    (sum, it) => sum + (it.product?.price || 0) * it.quantity,
    0
  );

  const validateAddress = () => {
    if (!address) return "Address is required";
    if (!city) return "City is required";
    if (!stateField) return "State is required";
    if (!pincode) return "Pincode is required";
    if (!country) return "Country is required";
    return null;
  };

  const handleCheckout = async () => {
    setFormError(null);
    const err = validateAddress();
    if (err) return setFormError(err);

    if (!cart.items.length) return setFormError("Cart is empty");
    setProcessing(true);

    try {
      const payload = {
        items: cart.items.map((it) => ({
          product: it.product._id,
          quantity: it.quantity,
        })),
        paymentMethod: "COD",
        totalAmount: total,
        shippingAddress: { address, city, pincode, state: stateField, country },
      };

      await api.post("/api/orders", payload);

      // Clear cart in background
      await Promise.all(
        cart.items.map((it) =>
          api.delete(`/api/cart/${it.product._id}`)
        )
      );

      window.location.href = "/orders";
    } catch (err) {
      setFormError(err.response?.data?.msg || err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="cart-page">
      <div className="container cart-grid">
        
        {/* LEFT ITEMS */}
        <div className="cart-items">
          <h2>Your Cart</h2>

          {cart.items.length === 0 && (
            <div className="card">Your cart is empty.</div>
          )}

          {cart.items.map((item) => {
            const p = item.product;
            const imgUrl = getImageUrl(p);

            return (
              <div key={item._id} className="cart-item card">

                <div className="cart-img-box">
                  <img src={imgUrl} alt={p.title} />
                </div>

                <div className="cart-info">
                  <h4>{p.title}</h4>
                  <p className="muted">Brand: {p.brand}</p>
                  <p className="price">₹{p.price}</p>

                  <div className="qty-control">
                    <label>Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQty(item._id, Number(e.target.value) || 1)
                      }
                    />
                    <button
                      className="btn-remove"
                      onClick={() => remove(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>

        {/* RIGHT SUMMARY */}
        <div className="cart-summary card">
          <h3>Order Summary</h3>

          <div className="summary-line">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="summary-line">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="summary-line total">
            <strong>Total</strong>
            <strong>₹{total}</strong>
          </div>

          {/* SHIPPING FORM */}
          <div className="shipping-form">
            <h4>Shipping Address</h4>

            <textarea
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="form-row">
              <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <input placeholder="State" value={stateField} onChange={(e) => setStateField(e.target.value)} />
            </div>

            <div className="form-row">
              <input placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
              <input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>

            {formError && <p className="error">{formError}</p>}

            <button className="add-btn-et single-add-btn" disabled={processing} onClick={handleCheckout}>
              {processing ? "Processing..." : "Checkout (COD)"}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
