import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Container, Spinner, Alert, Form } from "react-bootstrap";
import CustomNavbar from "../components/Navbar";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const storedUser = localStorage.getItem("user");
  const customerId = storedUser ? JSON.parse(storedUser).id : null;

  useEffect(() => {
    fetch(`http://localhost:8080/service/id/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setService(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching service details:", error);
        setLoading(false);
      });
  }, [id]);

  const handleBooking = () => {
    if (!customerId) {
      alert("Please log in to book a service.");
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time for booking.");
      return;
    }

    fetch(`http://localhost:8080/bookings/create?customerId=${customerId}&providerId=${service.id}`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          setBookingSuccess(true);
          setTimeout(() => {
            setBookingSuccess(false);
            navigate("/my-bookings"); // Redirect to My Bookings page
          }, 2000);
        } else {
          alert("Failed to book service. Try again.");
        }
      })
      .catch((error) => console.error("Error booking service:", error));
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading service details...</p>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container className="text-center mt-5">
        <p className="text-danger">Service not found.</p>
      </Container>
    );
  }

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <Card className="shadow-lg p-4 border-2">
          <Card.Body>
            {bookingSuccess && <Alert variant="success">Booking successful! Redirecting...</Alert>}
            <h3 className="text-center">{service.name}</h3>
            <p><strong>Service:  </strong>{service.serviceName}  &nbsp;&nbsp;&nbsp; <strong>Category:</strong> {service.category}</p>
            <p><strong>Provider:  </strong>{service.user.fullName}</p>
            <p><strong>Price:  </strong> ${service.price}</p>
            <p><strong>Availability:  </strong> {service.availability}</p>
            

            {/* Date & Time Selection */}
            <Form className="mt-4">
              <Form.Group>
                <Form.Label><strong>Select Date</strong></Form.Label>
                <Form.Control
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-primary"
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label><strong>Select Time</strong></Form.Label>
                <Form.Control
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="border-primary"
                />
              </Form.Group>
            </Form>

            <div className="text-center mt-4">
              <Button variant="success" onClick={handleBooking}>
                Book Now
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default ServiceDetails;
