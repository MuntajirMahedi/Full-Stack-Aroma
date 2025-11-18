const Cart = require("../models/Cart");

// ===============================
// ADD TO CART
// ===============================
exports.addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;  // frontend sends "product"

    if (!product) {
      return res.status(400).json({ msg: "Product ID is required" });
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    // Safe check avoid "undefined.toString()"
    const index = cart.items.findIndex(
      (item) =>
        item.product && item.product.toString() === product
    );

    if (index > -1) {
      // Already exists → increase qty
      cart.items[index].quantity += quantity;
    } else {
      // New item
      cart.items.push({ product, quantity });
    }

    await cart.save();

    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ msg: "Error adding to cart", error: err.message });
  }
};

// ===============================
// GET CART
// ===============================
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate("items.product");

    res.status(200).json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching cart", error: err.message });
  }
};

// ===============================
// REMOVE ITEM
// ===============================
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        item.product && item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ msg: "Error removing item", error: err.message });
  }
};

// ===============================
// UPDATE ITEM QUANTITY
// ===============================
exports.updateCartItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;  
    const { quantity } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { "items._id": id },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Quantity updated", cart });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
