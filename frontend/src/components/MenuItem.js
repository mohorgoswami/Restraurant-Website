import React from "react";
import "./MenuItem.css";

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <div className="menu-item">
      <img src={item.image} alt={item.name} className="menu-item-image" />
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      <div className="menu-item-footer">
        <span className="price">${item.price.toFixed(2)}</span>
        <button onClick={onAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default MenuItem;
