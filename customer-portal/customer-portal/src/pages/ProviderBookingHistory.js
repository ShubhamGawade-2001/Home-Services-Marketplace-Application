import React, { useEffect, useState } from "react";
import { Container, Alert, Card, Button, Row, Col, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProviderBookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        fetchBookingHistory(parsedUser.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const fetchBookingHistory = async (userId) => {
    if (!userId) {
      setError("User ID is missing.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/bookings/provider/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch booking history");

      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching booking history:", error);
      setError("Unable to load booking history.");
    }
  };

  return (
    <Container className="mt-4">
      {/* Back Button */}
      <div className="d-flex justify-content-start mb-3">
        <Button variant="outline-dark" onClick={() => navigate(-1)}>⬅ Back</Button>
      </div>

      {/* Title */}
      <h3 className="text-center mb-4 fw-bold text-primary">Booking History</h3>

      {/* Error Message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Booking History Cards */}
      {bookings.length > 0 ? (
        <Row className="justify-content-center">
          <Col md={8}>
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-3 mb-3 shadow-sm border-0 rounded-4">
                <Card.Body>
                  <h5 className="fw-bold mb-2">{booking.customer.fullName}</h5>
                  <p><strong>Service:</strong> {booking.serviceProvider.serviceName}</p>
                  <p><strong>Date & Time:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
                  <p><strong>Address:</strong> {booking.customer.address}</p>
                  <p><strong>Status:</strong> 
                    <Badge 
                      bg={booking.status === "COMPLETED" ? "success" : "secondary"} 
                      className="ms-2"
                    >
                      {booking.status}
                    </Badge>
                  </p>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      ) : (
        <p className="text-muted text-center">No past bookings found.</p>
      )}
    </Container>
  );
};

export default ProviderBookingHistory;
