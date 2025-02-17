import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

const ProviderDashboard = () => {
  const [earnings, setEarnings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [activeBookings, setActiveBookings] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const providerId = JSON.parse(localStorage.getItem("user"))?.id;
      if (!providerId) return;

      // Fetch total earnings
      const earningsResponse = await fetch(`http://localhost:8080/bookings/provider/${providerId}/earnings`);
      const earningsData = await earningsResponse.json();
      setEarnings(earningsData.totalEarnings || 0);

      // Fetch completed bookings count
      const completedResponse = await fetch(`http://localhost:8080/bookings/provider/${providerId}/completed`);
      const completedData = await completedResponse.json();
      setCompletedBookings(completedData.count || 0);

      // Fetch active bookings count
      const activeResponse = await fetch(`http://localhost:8080/bookings/provider/${providerId}/active`);
      const activeData = await activeResponse.json();
      setActiveBookings(activeData.count || 0);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="content">
        <h2 className="dashboard-title">Provider Dashboard</h2>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Total Earnings</h3>
            <div className="card-value">${earnings.toFixed(2)}</div>
            <div className="progress-bar" style={{ width: `${Math.min((earnings / 2000) * 100, 100)}%` }}></div>
          </div>
          <div className="dashboard-card">
            <h3>Completed Bookings</h3>
            <div className="card-value">{completedBookings}</div>
            <div className="progress-bar" style={{ width: `${Math.min((completedBookings / 50) * 100, 100)}%` }}></div>
          </div>
          <div className="dashboard-card">
            <h3>Active Bookings</h3>
            <div className="card-value">{activeBookings}</div>
            <div className="progress-bar" style={{ width: `${Math.min((activeBookings / 20) * 100, 100)}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
