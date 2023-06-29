import React, { useState } from 'react';
import "../navbar.css";
import SignupForm from "./signup";
import SigninForm from "./signin";

const Navbar = ({ updateLoggedInStatus }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showSignin, setShowSignin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowSignin(false);
  };

  const handleSigninClick = () => {
    setShowSignup(false);
    setShowSignin(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setShowSignup(false);
    setShowSignin(false);

    updateLoggedInStatus(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowSignup(false);
    setShowSignin(false);

    updateLoggedInStatus(true);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar__logo">ToDo</div>
        <div className="navbar__buttons">
          {!isLoggedIn && (
            <button onClick={handleSignupClick} className="navbar__button">
              Sign Up
            </button>
          )}
          {!isLoggedIn && (
            <button onClick={handleSigninClick} className="navbar__button">
              Log In
            </button>
          )}
          {isLoggedIn && (
            <button onClick={handleLogout} className="navbar__button">
              Log Out
            </button>
          )}
        </div>
      </nav>
      <div className="navbar__content">
        {showSignup && <SignupForm />}
        {showSignin && (
          <SigninForm onLoginSuccess={handleLoginSuccess} updateLoggedInStatus={updateLoggedInStatus} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        )}

      </div>
    </div>
  );
};

export default Navbar;
