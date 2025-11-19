import React, { useEffect, useState } from "react";
import api, { API_BASE } from "../api";

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Address Fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("");

  const [formError, setFormError] = useState(null);

  /** Image URL Fix */
  const getImageUrl = (product) => {
    if (!product?.images?.length) return "/placeholder.png";
    const url = product.images[0].url || "";
    if (/^(https?:)?\/\//i.test(url)) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  /** Load Cart */
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cart");
      let data = res.data || { items: [] };

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

  /** Remove item */
  const remove = async (productId) => {
    try {
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((it) => it.product._id !== productId),
      }));

      await api.delete(`/api/cart/${productId}`);
      window.dispatchEvent(new Event("cartChange"));
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    }
  };

  /** Update quantity */
  const updateQty = async (itemId, qty) => {
    if (qty < 1) return;

    setCart((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it._id === itemId ? { ...it, quantity: qty } : it
      ),
    }));

    try {
      await api.patch(`/api/cart/${itemId}`, { quantity: qty });
    } catch (err) {
      setError(err.response?.data?.msg || err.message);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  const total = cart.items.reduce(
    (sum, it) => sum + (it.product?.price || 0) * it.quantity,
    0
  );

  /** Validation */
  const validate = () => {
    if (!address) return "Address is required";
    if (!city) return "City is required";
    if (!stateField) return "State is required";
    if (!pincode) return "Pincode required";
    if (!country) return "Select country";
    return null;
  };

  /** Checkout */
  const handleCheckout = async () => {
    const err = validate();
    if (err) return setFormError(err);

    if (!cart.items.length) return setFormError("Cart is empty");

    setProcessing(true);

    try {
      await api.post("/api/orders", {
        items: cart.items.map((it) => ({
          product: it.product._id,
          quantity: it.quantity,
        })),
        paymentMethod: "COD",
        totalAmount: total,
        shippingAddress: {
          address,
          city,
          pincode,
          state: stateField,
          country,
        },
      });

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

        {/* LEFT CART ITEMS */}
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
                  <h3>{p.title}</h3>
                  <p className="muted">Brand: {p.brand}</p>
                  <p className="price">₹{p.price}</p>

                  <div className="qty-box">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQty(item._id, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={item.quantity}
                      onChange={(e) => {
                        let q = Number(e.target.value);
                        if (q < 1) q = 1;
                        if (q > 5) q = 5;
                        updateQty(item._id, q);
                      }}
                    />

                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQty(item._id, Math.min(5, item.quantity + 1))
                      }
                    >
                      +
                    </button>

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
            <strong>₹{total}</strong>
          </div>

          <div className="summary-line">
            <span>Shipping</span>
            <strong>Free</strong>
          </div>

          <div className="summary-line total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </div>

          {/* SHIPPING FORM */}
          <div className="shipping-form">
            <h4>Shipping Address</h4>

            <textarea
              className="textarea"
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="form-row">
              <input
                className="input"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <input
                className="input"
                placeholder="State"
                value={stateField}
                onChange={(e) => setStateField(e.target.value)}
              />
            </div>

            <div className="form-row">
              <input
                className="input"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />

              <select
                className="input-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="UAE">UAE</option>
                <option value="Australia">Australia</option>
                <option value="Japan">Japan</option>
              </select>
            </div>

            {formError && <p className="error">{formError}</p>}

            <button
              className="checkout-btn"
              disabled={processing}
              onClick={handleCheckout}
            >
              {processing ? "Processing..." : "Checkout (COD)"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
