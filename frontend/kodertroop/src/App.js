import React, { useState } from 'react';
import Navbar from "./components/navbar";
import Todo from "./components/todo";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const updateLoggedInStatus = (status) => {
    setIsLoggedIn(status);
  };

  return (
    <div className="App">
      <Navbar updateLoggedInStatus={updateLoggedInStatus} />
      <Todo isLoggedIn={isLoggedIn} />
    </div>
  );
}

export default App;
