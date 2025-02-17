import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const DashboardLayout = () => {
  return (
    <div className="d-flex vh-100">
      <Sidebar />

      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
