import React from "react";
import "./Cart.css";

const Cart = ({ cart, onRemoveFromCart }) => {
  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.menuItem._id} className="cart-item">
              <span>{item.menuItem.name}</span>
              <span>x{item.quantity}</span>
              <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
              <button
                onClick={() => onRemoveFromCart(item.menuItem._id)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: ${cart.totalAmount.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
