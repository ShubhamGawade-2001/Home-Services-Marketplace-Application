import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ fullName: "", email: "", address: "" });

  useEffect(() => {
    axios.get(`http://localhost:8080/users/profile/${id}`)
      .then(response => setUser(response.data))
      .catch(error => console.error("Failed to fetch user", error));
  }, [id]);

  const handleSave = () => {
    axios.put(`http://localhost:8080/users/profile/${id}`, user)
      .then(() => {
        alert("User updated successfully!");
        navigate("/dashboard/users"); // Redirect to user management
      })
      .catch(error => console.error("Error updating user", error));
  };

  const handleCancel = () => {
    navigate("/dashboard/users"); // Redirect to user management without saving
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "#f8f9fa",
      padding: "20px"
    }}>
      {/* Edit User Form */}
      <div style={{
        width: "100%",
        maxWidth: "600px",
        padding: "30px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
      }}>
        <h2 style={{ marginBottom: "25px", color: "#333", textAlign: "center" }}>Edit User</h2>

        {/* Full Name Field */}
        <label htmlFor="name" style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Full Name:</label>
        <input 
          id="name"
          type="text"
          value={user.fullName}
          onChange={(e) => setUser({ ...user, fullName: e.target.value })}
          style={{ width: "100%", marginBottom: "15px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        {/* Email Field */}
        <label htmlFor="email" style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Email:</label>
        <input 
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          style={{ width: "100%", marginBottom: "15px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        {/* Address Field */}
        <label htmlFor="address" style={{ fontWeight: "bold", display: "block", marginBottom: "5px" }}>Address:</label>
        <input 
          id="address"
          type="text"
          value={user.address}
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          style={{ width: "100%", marginBottom: "20px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        {/* Save Button */}
        <button 
          onClick={handleSave} 
          style={{
            width: "100%", padding: "12px",
            backgroundColor: "#007bff", color: "white",
            border: "none", borderRadius: "5px",
            fontSize: "16px", cursor: "pointer",
            transition: "0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
        >
          Save Changes
        </button>

        {/* Cancel Button */}
        <button 
          onClick={handleCancel} 
          style={{
            width: "100%", padding: "12px",
            backgroundColor: "#6c757d", color: "white",
            border: "none", borderRadius: "5px",
            fontSize: "16px", cursor: "pointer",
            marginTop: "10px",
            transition: "0.3s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#5a6268"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#6c757d"}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditUserPage;
