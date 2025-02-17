import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = ["CUSTOMER", "SERVICE_PROVIDER"];

  const onSubmit = async (data) => {
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/users/register",
        data
      );

      if (response.status === 201) {
        if (data.role === "CUSTOMER") {
          setSuccess("Registration successful! Redirecting to login...");
        } else {
          setSuccess("Request has been sent for approval.");
        }

        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "500px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full name"
                {...register("fullName", { required: "Full Name is required" })}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email format",
                  },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a strong password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Must include a number and special character",
                  },
                })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Address */}
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your full address"
                {...register("address", { required: "Address is required" })}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Role Dropdown */}
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select {...register("role", { required: "Role is required" })} isInvalid={!!errors.role}>
                <option value="">Select Role</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>
                    {role.replace("_", " ")}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.role?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" disabled={loading} className="w-100">
              {loading ? <Spinner animation="border" size="sm" /> : "Register"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p>
              Already registered?{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/login")}>
                Login Here
              </Button>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
