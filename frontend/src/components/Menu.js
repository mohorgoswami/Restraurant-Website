import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Menu.css";
// import HeroSection from "./HeroSection";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    totalItems: 0,
  });
  const [showCart, setShowCart] = useState(false);
  const userId = "user123";

  useEffect(() => {
    fetchMenuItems();
    fetchCart();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/menu");
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/cart/${userId}`
      );
      const totalItems = response.data.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      setCart({ ...response.data, totalItems });
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (menuItemId) => {
    try {
      await axios.post(`http://localhost:5000/api/cart/${userId}/add`, {
        menuItemId,
        quantity: 1,
      });
      fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (menuItemId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/cart/${userId}/remove/${menuItemId}`
      );
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
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

      {/* <HeroSection /> */}

      {showCart && cart.items.length > 0 && (
        <div className="cart-modal">
          <div className="cart-content">
            <h2>Your Cart</h2>
            {cart.items.map((item) => (
              <div key={item.menuItem._id} className="cart-item">
                <span className="item-name">{item.menuItem.name}</span>
                <div className="item-controls">
                  <button onClick={() => removeFromCart(item.menuItem._id)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => addToCart(item.menuItem._id)}>
                    +
                  </button>
                </div>
                <span className="item-price">
                  ${(item.menuItem.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="cart-total">
              <strong>Total Amount:</strong>
              <span>${cart.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="menu-items">
        {menuItems.map((item) => (
          <div key={item._id} className="menu-item">
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span className="price">${item.price.toFixed(2)}</span>
            </div>
            <div className="item-actions">
              <button
                onClick={() => addToCart(item._id)}
                className="add-button"
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
