const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const { createShiprocketShipment } = require("./shiprocketController");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order
exports.createOrder = async (req, res) => {
  const { amount, currency = "INR", receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // convert to paise
      currency,
      receipt
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ msg: "Razorpay order creation failed", error: err.message });
  }
};

// Verify Payment Signature
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    res.status(200).json({ msg: "Payment verified successfully", success: true });
  } else {
    res.status(400).json({ msg: "Invalid signature", success: false });
  }
};
