import React from "react";
import Menu from "./components/Menu";
import "./App.css";

function App() {
  // Menu component now owns fetching and displaying menu + cart modal.
  return (
    <div className="App">
      <Menu />
    </div>
  );
}

export default App;
