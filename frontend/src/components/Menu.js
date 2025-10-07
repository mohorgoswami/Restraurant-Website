import React, { useState, useEffect } from "react";
import axios from "axios";
import MenuItem from "./MenuItem";
import "./Menu.css";

const sampleMenu = [
  {
    _id: "1",
    name: "Margherita Pizza",
    description: "Classic pizza with tomato, mozzarella, and basil.",
    price: 9.99,
    image: "",
  },
  {
    _id: "2",
    name: "Spaghetti Carbonara",
    description: "Pasta with pancetta, egg, and pecorino cheese.",
    price: 12.5,
    image: "",
  },
  {
    _id: "3",
    name: "Caesar Salad",
    description: "Crisp romaine with Caesar dressing and croutons.",
    price: 7.25,
    image: "",
  },
];

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 });
  const [showCart, setShowCart] = useState(false);
  const userId = "user123";

  useEffect(() => {
    fetchMenuItems();
    fetchCart();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/menu");
      if (response.data && response.data.length > 0) {
        setMenuItems(response.data);
      } else {
        setMenuItems(sampleMenu);
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      setMenuItems(sampleMenu);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      const totalItems = response.data.items.reduce((acc, item) => acc + item.quantity, 0);
      setCart({ ...response.data, totalItems });
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    }
  };

  const addToCart = async (menuItemId) => {
    try {
      await axios.post(`http://localhost:5000/api/cart/${userId}/add`, {
        menuItemId,
        quantity: 1,
      });
      await fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Optimistic UI fallback: update local cart if backend not available
      const menuItem = menuItems.find((m) => m._id === menuItemId);
      if (menuItem) {
        setCart((prev) => {
          const existing = prev.items.find((it) => it.menuItem._id === menuItemId);
          if (existing) {
            existing.quantity += 1;
            return { ...prev, totalItems: prev.totalItems + 1, totalAmount: prev.totalAmount + menuItem.price };
          }
          const newItems = [...prev.items, { menuItem, quantity: 1 }];
          return { items: newItems, totalItems: prev.totalItems + 1, totalAmount: prev.totalAmount + menuItem.price };
        });
      }
    }
  };

  const removeFromCart = async (menuItemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${userId}/remove/${menuItemId}`);
      await fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
      // Optimistic local remove fallback
      setCart((prev) => {
        const newItems = prev.items.filter((it) => it.menuItem._id !== menuItemId);
        const totalAmount = newItems.reduce((sum, it) => sum + it.menuItem.price * it.quantity, 0);
        const totalItems = newItems.reduce((sum, it) => sum + it.quantity, 0);
        return { items: newItems, totalAmount, totalItems };
      });
    }
  };

  return (
    <div className="menu-container">
      <header className="header">
        <h1>ReactMeals</h1>
        <button className="cart-button" onClick={() => setShowCart(!showCart)}>
          🛒 Your Cart <span className="badge">{cart.totalItems || 0}</span>
        </button>
      </header>

      {showCart && (
        <div className="cart-modal">
          <div className="cart-content">
            <h2>Your Cart</h2>
            {cart.items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.items.map((item) => (
                <div key={item.menuItem._id} className="cart-item">
                  <span className="item-name">{item.menuItem.name}</span>
                  <div className="item-controls">
                    <button onClick={() => removeFromCart(item.menuItem._id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item.menuItem._id)}>+</button>
                  </div>
                  <span className="item-price">${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
            <div className="cart-total">
              <strong>Total Amount:</strong>
              <span>${cart.totalAmount ? cart.totalAmount.toFixed(2) : "0.00"}</span>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button onClick={() => setShowCart(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="menu-items">
        {menuItems.map((item) => (
          <MenuItem
            key={item._id}
            item={item}
            onAdd={() => addToCart(item._id)}
            onRemove={() => removeFromCart(item._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;
