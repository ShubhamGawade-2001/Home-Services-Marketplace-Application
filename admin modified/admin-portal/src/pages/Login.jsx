// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.text();
      
      if (data === "Login successful") {
        localStorage.setItem("isAdminLoggedIn", "true");
        navigate("/dashboard/users");
      } else {
        setErrorMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred while logging in.");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex flex-col justify-content-center align-items-center">
      <div className="card p-5 shadow border-radious-pill" style={{ maxWidth: "500px", width: "100%" }}>
        <div className="display text-center fs-3">Home Service Management</div>
        <h2 className="text-center text-primary">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-control ${errorMessage ? "is-invalid" : ""}`}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`form-control ${errorMessage ? "is-invalid" : ""}`}
              required
            />
          </div>
          {errorMessage && (
            <div className="text-danger mb-3">{errorMessage}</div>
          )}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          {/* <div className="text-center mt-3">
            <a href="#" className="text-decoration-none">
              Forgot Password?
            </a>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default Login;

