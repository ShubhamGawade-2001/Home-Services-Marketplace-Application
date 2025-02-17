import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // Default to "None"
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/users/")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load users!");
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    toast.info(`Editing user ${id}`);
    navigate(`/dashboard/users/edit/${id}`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/users/delete/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
        toast.success(`User ${id} deleted successfully!`);
      })
      .catch(() => {
        toast.error("Failed to delete user!");
      });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) &&
      (roleFilter === "" || user.role === roleFilter) // Show all users if "None" is selected
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">User Management</h2>

      {/* Search & Filter Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search by name..."
          className="form-control me-2 search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '250px' }} 
        />
        <select
          className="form-select filter-box"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{ width: '180px' }}  
        >
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="SERVICE_PROVIDER">Service Provider</option>
        </select>
      </div>

      {/* User Table */}
      {loading ? (
        <p className="text-center text-muted">Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover shadow-sm rounded">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.role}</td>
                    <td>{user.email}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(user.id)}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default UserManagement;
