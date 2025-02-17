import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ApproveServiceProvider = () => {
  const [unapprovedProviders, setUnapprovedProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch unapproved service providers
  useEffect(() => {
    axios
      .get("http://localhost:8080/users/unapproved")
      .then((response) => {
        setUnapprovedProviders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to load unapproved service providers!");
        setLoading(false);
      });
  }, []);

  // Filter providers based on search query
  const filteredProviders = unapprovedProviders.filter((provider) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      provider.fullName.toLowerCase().includes(searchLower) ||
      provider.email.toLowerCase().includes(searchLower) ||
      provider.address.toLowerCase().includes(searchLower)
    );
  });

  // Approve service provider
  const handleApprove = (id) => {
    axios
      .post(`http://localhost:8080/users/approve/${id}`)
      .then(() => {
        toast.success("Service provider approved successfully!");
        setUnapprovedProviders(unapprovedProviders.filter((provider) => provider.id !== id)); // Remove from UI
      })
      .catch((error) => {
        toast.error("Failed to approve service provider!");
        console.error("Approval error:", error);
      });
  };

  // Reject service provider
  const handleReject = (id) => {
    axios
      .delete(`http://localhost:8080/users/reject/${id}`)
      .then(() => {
        toast.success("Service provider rejected successfully!");
        setUnapprovedProviders(unapprovedProviders.filter((provider) => provider.id !== id)); // Remove from UI
      })
      .catch((error) => {
        toast.error("Failed to reject service provider!");
        console.error("Rejection error:", error);
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Approve Service Provider</h2>

      {/* Search input */}
      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by name, email, or address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading indicator */}
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive">
          {/* Table of service providers */}
          <table className="table table-hover table-bordered table-striped">
            <thead className="thead-dark">
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No unapproved service providers found.
                  </td>
                </tr>
              ) : (
                filteredProviders.map((provider) => (
                  <tr key={provider.id}>
                    <td>{provider.id}</td>
                    <td>{provider.fullName}</td>
                    <td>{provider.email}</td>
                    <td>{provider.address}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm m-1"
                        onClick={() => handleApprove(provider.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger btn-sm m-1"
                        onClick={() => handleReject(provider.id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ApproveServiceProvider;
