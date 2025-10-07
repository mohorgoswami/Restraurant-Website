import React from "react";
import "./MenuItem.css";

const MenuItem = ({ item, onAdd, onRemove }) => {
  return (
    <div className="menu-item">
      {item.image && (
        <img src={item.image} alt={item.name} className="menu-item-image" />
      )}
      <div className="menu-item-body">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
      </div>
      <div className="menu-item-footer">
        <span className="price">${item.price.toFixed(2)}</span>
        <div className="qty-controls">
          <button className="remove-small" onClick={onRemove} aria-label={`Remove ${item.name}`}>
            -
          </button>
          <button className="add-small" onClick={onAdd} aria-label={`Add ${item.name}`}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
