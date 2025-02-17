import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/");
  };

  return (
    <div className="sidebar bg-dark text-white p-3 vh-100">
      <h1 className="fs-3 text-center text-warning">Home Service Management</h1>
      <hr />
      <h2 className="text-center text-white fs-3">Admin Panel</h2>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/users">
            User Management
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/services">
            Service Management
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/approve-service-provider">
            Approve Service Provider
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link text-white" to="/dashboard/disputes">
            Dispute Handling
          </NavLink>
        </li>
        
        <li className="nav-item mt-3">
          <button onClick={handleLogout} className="btn btn-danger w-100">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
