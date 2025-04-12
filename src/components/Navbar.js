import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // For redirection
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Check login status on component mount or location change
    const authToken = localStorage.getItem("auth-token");
    setIsLoggedIn(!!authToken);
    
    if (authToken) {
      const storedName = localStorage.getItem("user-name");
      setUserName(storedName || "");
    }
  }, [location]); // Re-run when location changes

  const handleLogout = () => {
    localStorage.removeItem("auth-token"); // Remove the token
    localStorage.removeItem("user-name"); // Remove the username
    localStorage.removeItem("userId"); // Remove the user ID
    setIsLoggedIn(false); // Update state
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          iNoteCloud
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
                className={`nav-link ${location.pathname === "/forum" ? "active" : ""}`}
                to="/forum"
              >
                Discussion Forum
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
          
          <div className="d-flex align-items-center">
            {isLoggedIn && userName && (
              <span className="text-light me-3 d-none d-md-block">Welcome, {userName}</span>
            )}
            
            {!isLoggedIn ? (
              <>
                <Link className="btn btn-primary me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-outline-light" to="/signup">
                  Signup
                </Link>
              </>
            ) : (
              <button className="btn btn-primary" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
