import React from "react";
import Menu from "./components/Menu";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Restaurant Menu</h1>
      </header>
      <main>
        <Menu />
      </main>
    </div>
  );
}

export default App;
