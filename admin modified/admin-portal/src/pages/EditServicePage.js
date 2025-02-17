import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const EditServicePage = () => {
  const { id } = useParams(); // Get service ID from URL
  const navigate = useNavigate();
  const [service, setService] = useState({
    serviceName: "",
    price: "",
    providerName: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch existing service data
  useEffect(() => {
    axios
      .get(`http://localhost:8080/service/id/${id}`)
      .then((response) => {
        const serviceData = response.data;
        setService({
          serviceName: serviceData.serviceName || "",
          price: serviceData.price || "",
          providerName: serviceData.user?.fullName || "N/A",
        });
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to load service details!");
        setLoading(false);
      });
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
  };

  // Save Updated Service
  const handleSave = () => {
    axios
      .put(`http://localhost:8080/service/profile/update/${id}`, {
        serviceName: service.serviceName,
        price: service.price,
      })
      .then(() => {
        toast.success("Service updated successfully!");
        setTimeout(() => navigate("/dashboard/services"), 1500);
      })
      .catch((error) => {
        toast.error("Failed to update service!");
        console.error("Update error:", error);
      });
  };

  return (
    <div className="container mt-4">
      <h2>Edit Service</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="form-group">
          <label>Service Name</label>
          <input
            type="text"
            className="form-control"
            name="serviceName"
            value={service.serviceName}
            onChange={handleChange}
          />

          <label>Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={service.price}
            onChange={handleChange}
          />

          <label>Provider</label>
          <input
            type="text"
            className="form-control"
            value={service.providerName}
            disabled
          />

          <button className="btn btn-success mt-3" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn btn-secondary mt-3 ml-2" onClick={() => navigate("/dashboard/services")}>
            Cancel
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default EditServicePage;

