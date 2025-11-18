const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    const order = new Order({
      user: req.user.userId,
      items,
      shippingAddress,
      paymentMethod,
      totalAmount
    });

    await order.save();
    res.status(201).json({ msg: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ msg: "Error creating order", error: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders", error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching all orders", error: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ msg: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ msg: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ msg: "Error updating order", error: err.message });
  }
};
