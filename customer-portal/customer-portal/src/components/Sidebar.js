// src/components/Sidebar.js
import { Button } from "bootstrap";
import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Nav className="flex-column">
        <Nav.Link as={NavLink} to="/providerdashboard" end>
          Dashboard
        </Nav.Link>
        <Nav.Link as={NavLink} to="/manage-services">
          {" "}
          {/* ✅ Relative Path */}
          Manage Services
        </Nav.Link>
        <Nav.Link as={NavLink} to="/booking-requests">
          {" "}
          {/* ✅ Relative Path */}
          Booking Requests
        </Nav.Link>
        <Nav.Link as={NavLink} to="/provider-booking-history">Booking History</Nav.Link>
        <Nav.Link as={NavLink} to="/provider-profile">
          {" "}
          {/* ✅ Relative Path */}
          Profile
        </Nav.Link>
        <Nav.Link as={NavLink} to="/login">
          Logout
        </Nav.Link>
       
      </Nav>
    </div>
  );
};

export default Sidebar;