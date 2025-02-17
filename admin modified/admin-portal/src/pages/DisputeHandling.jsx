import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/DisputeHandling.css";

const DisputeHandling = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/disputes")
      .then((response) => {
        setDisputes(response.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load disputes!");
        setLoading(false);
      });
  }, []);

  const updateDisputeStatus = async (id, newStatus) => {
    try {
      const dispute = disputes.find(d => d.id === id);
      if (dispute.status === "RESOLVED") return; // Prevent updating already resolved disputes

      await axios.put(`http://localhost:8080/disputes/${id}/update-status?status=${newStatus}`);
      setDisputes(disputes.map(d => d.id === id ? { ...d, status: newStatus } : d));
      toast.success(`Dispute ${id} updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update dispute status!");
    }
  };

  const filteredDisputes = disputes.filter(dispute =>
    dispute.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (statusFilter ? dispute.status === statusFilter : true)
  );

  return (
    <div className="container mt-4">
      <h2>Dispute Handling</h2>

      {/* Search & Filter Controls */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Search Bar (Left) */}
        <input
          type="text"
          placeholder="Search by customer..."
          className="form-control w-25"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Status Filter Dropdown (Right) */}
        <select
          className="form-select w-25"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="ESCALATED">Escalated</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Provider</th>
              <th>Customer</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDisputes.map((dispute) => (
              <tr key={dispute.id}>
                <td>{dispute.id}</td>
                <td>{dispute.provider}</td>
                <td>{dispute.customer}</td>
                <td>{dispute.description}</td>
                <td className={`fw-bold ${dispute.status === "RESOLVED" ? "text-success" : "text-danger"}`}>
                  {dispute.status}
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm m-1"
                    disabled={dispute.status === "RESOLVED"}
                    onClick={() => updateDisputeStatus(dispute.id, "RESOLVED")}
                  >
                    Resolve
                  </button>
                  <button
                    className="btn btn-warning btn-sm m-1"
                    disabled={dispute.status === "RESOLVED" || dispute.status === "ESCALATED"}
                    onClick={() => updateDisputeStatus(dispute.id, "ESCALATED")}
                  >
                    Escalate
                  </button>
                  <button
                    className="btn btn-info btn-sm m-1"
                    disabled={dispute.status === "RESOLVED"}
                    onClick={() => updateDisputeStatus(dispute.id, "UNDER_REVIEW")}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ToastContainer />
    </div>
  );
};

export default DisputeHandling;
