import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import CustomNavbar from "../components/Navbar";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaStar } from "react-icons/fa"; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("User"); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCustomerName(userData.name || "User");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <>
      <CustomNavbar />

      {/* Hero Section */}
      <section className="hero bg-danger text-white py-5 text-center">
        <Container>
          <h2 className="animate__animated animate__fadeIn">
            Welcome, {customerName}!
          </h2>
          <p>
            Choose from a variety of services or manage your existing bookings.
          </p>
          <Button
            variant="light"
            size="lg"
            className="mt-3"
            onClick={() => navigate("/services")}
          >
            Explore Services
          </Button>
        </Container>
      </section>

      {/* Features Section */}
      <section className="container features py-5 bg-light">
        <Container>
          <h3 className="text-center mb-4">Our Features</h3>
          <Row>
            <Col md={4} className="mb-3">
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <h5>Reliable Service Providers</h5>
                  <p>
                    We connect you with trusted professionals for all your home
                    service needs.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <h5>Instant Booking</h5>
                  <p>
                    Book services instantly with just a few clicks, at your
                    preferred time.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-3">
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <h5>Affordable Pricing</h5>
                  <p>
                    Get high-quality services at affordable rates, with no
                    hidden charges.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Dashboard;
