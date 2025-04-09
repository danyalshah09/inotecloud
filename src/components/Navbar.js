import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const authToken = localStorage.getItem('auth-token');
  const userName = localStorage.getItem('user-name');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-name');
    localStorage.removeItem('user-id');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span style={{ color: "hsl(218, 81%, 75%)" }}>iNoteCloud</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            {authToken ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    Welcome, <span className="fw-bold" style={{ color: "hsl(218, 81%, 55%)" }}>{userName}</span>
                  </span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={() => setIsMenuOpen(false)}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/forum" onClick={() => setIsMenuOpen(false)}>
                    Forum
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger btn-sm ms-2 mt-2 mt-md-0"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup" onClick={() => setIsMenuOpen(false)}>
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
