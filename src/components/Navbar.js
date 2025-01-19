import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // For redirection
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status on component mount or location change
    setIsLoggedIn(!!localStorage.getItem("auth-token"));
  }, [location]); // Re-run when location changes

  const handleLogout = () => {
    localStorage.removeItem("auth-token"); // Remove the token
    setIsLoggedIn(false); // Update state
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand text-white" to="/">
        iNoteCloud
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
              to="/"
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
              to="/about"
            >
              About
            </Link>
          </li>
        </ul>
        {!isLoggedIn ? (
          <>
            <Link type="button" className="btn btn-primary mx-2" to="/login">
              Login
            </Link>
            <Link type="button" className="btn btn-primary" to="/signup">
              Signup
            </Link>
          </>
        ) : (
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
