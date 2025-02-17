import React, { useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {  
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [error, setError] = useState("");

  const onSubmit = async (data) => {
    setError("");

    try {
      const response = await fetch("http://localhost:8080/users/login", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
        setIsLoggedIn(true);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Redirecting to Register...");
        setTimeout(() => navigate("/register"), 3000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email format" },
                })}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isSubmitting} className="w-100">
              {isSubmitting ? <Spinner animation="border" size="sm" /> : "Login"}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p className="mb-1">Forgot Password?</p>
            <p>
              Not registered?{" "}
              <Button variant="link" className="p-0" onClick={() => navigate("/register")}>
                Register Here
              </Button>
            </p>
            <p className="mt-2">
              <Button variant="link" className="p-0" onClick={() => navigate("/providerlogin")}>
                Login as Service Provider
              </Button>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
