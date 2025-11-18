import React, { useEffect, useState } from "react";
import api, { API_BASE } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImg = (p) => {
    if (!p?.images?.length) return "/placeholder.png";
    const url = p.images[0].url;
    return url.startsWith("http")
      ? url
      : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/orders/my-orders");
        setOrders(res.data || []);
      } catch (err) {
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="orders-loading">Loading...</p>;
  if (error) return <p className="orders-error">Error: {error}</p>;

  return (
    <div className="orders-page">
      <h2>Your Orders</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((o) => (
        <div key={o._id} className="order-card">

          {/* ORDER HEADER */}
          <div className="order-header">
            <div>
              <strong>Order ID:</strong> {o._id}
            </div>
            <div>
              <strong>Date:</strong>{" "}
              {new Date(o.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* ORDER STATUS */}
          <div
            className={`order-status-badge ${
              (o.status || "Pending").toLowerCase()
            }`}
          >
            {o.status || "Pending"}
          </div>

          {/* ORDER ITEMS */}
          <div className="order-items">
            {o.items.map((it) => (
              <div key={it._id} className="order-product">
                <img
                  src={getImg(it.product)}
                  alt={it.product?.title}
                  className="order-product-img"
                />

                <div className="order-product-info">
                  <h4>{it.product?.title}</h4>
                  <p className="muted">{it.product?.brand}</p>

                  <p>
                    <strong>Price:</strong> ₹{it.product?.price}
                  </p>

                  <p>
                    <strong>Qty:</strong> {it.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ORDER SUMMARY */}
          <div className="order-summary">
            <p>
              <strong>Total Items:</strong> {o.items.length}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹
              {o.totalAmount ||
                o.items.reduce(
                  (sum, it) =>
                    sum + (it.product?.price || 0) * it.quantity,
                  0
                )}
            </p>
            <p>
              <strong>Payment:</strong> {o.paymentMethod || "N/A"}
            </p>
          </div>

          {/* SHIPPING INFO */}
          <div className="order-shipping">
            <h4>Shipping Address</h4>
            <p>{o.shippingAddress?.address}</p>
            <p>
              {o.shippingAddress?.city}, {o.shippingAddress?.state}
            </p>
            <p>
              {o.shippingAddress?.pincode}, {o.shippingAddress?.country}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
