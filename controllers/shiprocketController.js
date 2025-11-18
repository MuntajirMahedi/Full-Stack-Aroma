const axios = require("axios");

let token = null;

// Authenticate with Shiprocket
const authenticateShiprocket = async () => {
  if (token) return token;

  try {
    const response = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    });

    token = response.data.token;

    // Auto-expire token after 10 mins
    setTimeout(() => {
      token = null;
    }, 10 * 60 * 1000);

    return token;
  } catch (err) {
    console.error("Shiprocket auth failed:", err.message);
    throw new Error("Failed to authenticate with Shiprocket");
  }
};

// Create Shipment Order
exports.createShipment = async (req, res) => {
  try {
    const {
      order_id,
      order_date,
      billing_customer_name,
      billing_address,
      billing_city,
      billing_state,
      billing_pincode,
      billing_email,
      billing_phone,
      order_items,
      payment_method,
      shipping_charges,
      total_discount,
      sub_total,
      length,
      breadth,
      height,
      weight
    } = req.body;

    const authToken = await authenticateShiprocket();

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      {
        order_id,
        order_date,
        pickup_location: "Default", // Configure this in your Shiprocket dashboard
        billing_customer_name,
        billing_address,
        billing_city,
        billing_state,
        billing_pincode,
        billing_email,
        billing_phone,
        order_items,
        payment_method,
        shipping_charges,
        total_discount,
        sub_total,
        length,
        breadth,
        height,
        weight
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    );

    res.status(200).json({
      msg: "Shipment created successfully",
      data: response.data
    });
  } catch (err) {
    console.error("Shiprocket order error:", err.message);
    res.status(500).json({ msg: "Failed to create shipment", error: err.message });
  }
};
