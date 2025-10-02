import React from "react";
import "./Header.css";

const Header = ({ cartCount }) => {
  return (
    <header className="header">
      <h1>ReactMeals</h1>
      <button className="cart-button">
        🛒 Your Cart <span className="badge">{cartCount}</span>
      </button>
    </header>
  );
};

export default Header;
