import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/ServiceManagement.css";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/service/services") 
      .then((response) => {
        setServices(response.data); 
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to load services!");
        setLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    navigate(`/dashboard/service/profile/update/${id}`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/service/delete/${id}`)
      .then(() => {
        toast.success("Service deleted successfully!");
        setServices(services.filter(service => service.id !== id)); 
      })
      .catch((error) => {
        toast.error("Failed to delete service!");
        console.error("Delete error:", error);
      });
  };


  const filteredServices = services.filter(
    (service) =>
      service.serviceName.toLowerCase().includes(search.toLowerCase()) &&
      (providerFilter === "" || service.user?.fullName.toLowerCase().includes(providerFilter.toLowerCase()))
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">Service Management</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          placeholder="Search by service name..."
          className="form-control me-2 search-box"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '250px' }} 
        />
        <input
          type="text"
          placeholder="Search by provider..."
          className="form-control me-2 filter-box"
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          style={{ width: '250px' }} 
        />
      </div>

      {loading ? (
        <p className="text-center text-muted">Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover shadow-sm rounded">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Provider</th>
                <th>Price</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>{service.id}</td>
                    <td>{service.serviceName}</td>
                    <td>{service.user?.fullName || "N/A"}</td>
                    <td>${service.price || "N/A"}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(service.id)}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(service.id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No services found.
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

export default ServiceManagement;
