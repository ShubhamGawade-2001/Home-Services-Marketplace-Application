import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"))?.name || "User";

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-2">
      <div className="container-fluid d-flex align-items-center">
        {/* Left: Welcome User */}
        {isLoggedIn && (
          <span className="navbar-brand fw-semibold text-white ms-3">Welcome, {user}!</span>
        )}

        {/* Navbar Toggle for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Right: Navigation Links & Logout Button */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-3">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link fw-medium fs-5">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/services" className="nav-link fw-medium fs-5">Services</Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-bookings" className="nav-link fw-medium fs-5">My Bookings</Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className="nav-link fw-medium fs-5">Profile</Link>
                </li>

                {/* Logout Button - Now Aligned with Menu Options */}
                <li className="nav-item">
                  <button className="btn btn-outline-light fw-semibold fs-5" onClick={handleLogout}>
                    Logout
                  </button>
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
