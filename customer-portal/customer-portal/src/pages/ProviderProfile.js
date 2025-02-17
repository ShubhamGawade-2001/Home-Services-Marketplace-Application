import React, { useEffect, useState } from "react";
import { Container, Form, Button, Alert, Modal, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProviderProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    name: "User",
    email: "user@example.com",
    address: "Not provided",
    password: "********",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        fetchUserProfile(parsedUser.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/users/profile/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user profile");

      const userData = await response.json();
      setUser({
        id: userData.id,
        name: userData.fullName,
        email: userData.email,
        address: userData.address || "Not provided",
        password: "********",
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: user.name,
          email: user.email,
          address: user.address,
          password: user.password !== "********" ? user.password : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-start mb-3">
        <Button variant="outline-dark" onClick={() => navigate(-1)}>⬅ Back</Button>
      </div>

      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg border-0 rounded-4">
            <Card.Body>
              <h3 className="text-center mb-4 fw-bold text-primary">Profile</h3>
              {showSuccessMessage && <Alert variant="success">Changes saved successfully!</Alert>}
              
              <Form>
                <Form.Group controlId="name">
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="rounded-3"
                    required
                  />
                </Form.Group>

                <Form.Group controlId="email" className="mt-3">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control type="email" value={user.email} disabled className="rounded-3 bg-light" />
                </Form.Group>

                <Form.Group controlId="address" className="mt-3">
                  <Form.Label className="fw-semibold">Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={user.address}
                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                    className="rounded-3"
                    required
                  />
                </Form.Group>

                <Button variant="primary" className="mt-4 w-100 rounded-3 fw-semibold" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col md={6} className="d-flex justify-content-center">
          <Button variant="danger" className="rounded-3 fw-semibold" onClick={() => setShowLogoutModal(true)}>
            Logout
          </Button>
        </Col>
      </Row>

      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">Are you sure you want to log out?</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="secondary" className="rounded-3" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="rounded-3" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProviderProfile;
