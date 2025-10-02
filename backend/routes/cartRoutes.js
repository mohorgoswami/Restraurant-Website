const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const MenuItem = require("../models/MenuItem");

// Get cart for a user
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "items.menuItem"
    );
    if (!cart) {
      return res.json({ items: [], totalAmount: 0 });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post("/:userId/add", async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      cart = new Cart({
        userId: req.params.userId,
        items: [],
        totalAmount: 0,
      });
    }

    const existingItem = cart.items.find(
      (item) => item.menuItem.toString() === menuItemId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        menuItem: menuItemId,
        quantity,
      });
    }

    cart.totalAmount = cart.items.reduce((total, item) => {
      return total + menuItem.price * item.quantity;
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove item from cart
router.delete("/:userId/remove/:menuItemId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.menuItem.toString() !== req.params.menuItemId
    );

    const menuItems = await MenuItem.find({
      _id: { $in: cart.items.map((item) => item.menuItem) },
    });

    cart.totalAmount = cart.items.reduce((total, item) => {
      const menuItem = menuItems.find(
        (mi) => mi._id.toString() === item.menuItem.toString()
      );
      return total + menuItem.price * item.quantity;
    }, 0);

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
