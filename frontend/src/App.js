import React, { useState } from "react";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import "./App.css";

function App() {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });

  const handleRemoveFromCart = (menuItemId) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.menuItem._id !== menuItemId),
      totalAmount: prev.items
        .filter((item) => item.menuItem._id !== menuItemId)
        .reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    }));
  };

  return (
    <div className="App">
      {/* Navbar with Cart count */}
      <Header cartCount={cart.items.length} />

      {/* Hero Section */}
      <HeroSection />

      {/* Menu + Cart */}
      <main style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
        <Menu />
        <Cart cart={cart} onRemoveFromCart={handleRemoveFromCart} />
      </main>
    </div>
  );
}

export default App;
