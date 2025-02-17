import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import DisputeHandling from "./pages/DisputeHandling";
//import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditServicePage from "./pages/EditServicePage";
import EditUserPage from "./pages/EditUserPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ServiceManagement from "./pages/ServiceManagement";
import UserManagement from "./pages/UserManagement";
import ApproveServiceProvider from "./pages/ApproveServiceProvider";



function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard Routes with Sidebar */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* <Route index element={<Dashboard />} /> */}
          <Route  index path="users" element={<UserManagement />} />
          <Route path="services" element={<ServiceManagement />} />
          <Route path="disputes" element={<DisputeHandling />} />
          <Route path="approve-service-provider" element={<ApproveServiceProvider/>} />
         
        {/* <Route path="/dashboard/users" element={UserManagement} /> */}
        <Route path="users/edit/:id" element={<EditUserPage />} />
        <Route path="service/profile/update/:id" element={<EditServicePage />} />

          {/* <Route path="/edit-user/:id" component={EditUserPage} />
          <Route path="/dashboard/users" component={UserManagement} /> */}
        </Route>

        {/* Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
