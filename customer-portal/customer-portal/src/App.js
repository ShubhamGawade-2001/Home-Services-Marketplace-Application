import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

// Import Components & Pages
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SearchServices from "./pages/SearchServices";
import ServiceDetails from "./pages/ServiceDetails";
import ProviderLogin from "./pages/ProviderLogin";
import ProviderDashboard from "./pages/ProviderDashboard";
import ManageServices from "./pages/ManageServices";
import BookingRequests from "./pages/BookingRequests";
import ProviderBookingHistory from "./pages/ProviderBookingHistory";
import ProviderProfile from "./pages/ProviderProfile";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));

  return (
    <Router>
      <MainContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
};

const MainContent = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  
  // Show Navbar only on these pages
  const showNavbar = ["/dashboard", "/services", "/my-bookings", "/profile", "/service/:id"].some((path) =>
    location.pathname.startsWith(path.replace(":id", ""))
  );

  return (
    <>
      {showNavbar && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/providerlogin" element={<ProviderLogin />} />
        <Route path="/providerdashboard" element={<ProviderDashboard />} />
        <Route path="/manage-services" element={<ManageServices />} />
        <Route path="/booking-requests" element={<BookingRequests />} />
        <Route path="/provider-booking-history" element={<ProviderBookingHistory />} />
        <Route path="/provider-profile" element={<ProviderProfile />} />

        {isLoggedIn && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<SearchServices />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/service/:id" element={<ServiceDetails />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
