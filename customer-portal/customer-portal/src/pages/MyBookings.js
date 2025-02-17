import React, { useState, useEffect } from "react";
import CustomNavbar from "../components/Navbar";
import { Container, Button, Card, Modal, Form } from "react-bootstrap";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const storedUser = localStorage.getItem("user");
  const userData = JSON.parse(storedUser);
  const customerId = userData.id;

  useEffect(() => {
    fetch(`http://localhost:8080/bookings/customer/${customerId}`)
      .then((response) => response.json())
      .then((data) => {
        // Filter out completed and cancelled bookings
        const activeBookings = data.filter(
          (booking) => booking.status !== "CANCELLED" && booking.status !== "COMPLETED"
        );
        setBookings(activeBookings);
      })
      .catch((error) => console.error("Error fetching bookings:", error));
  }, []);

  const handleCancelBooking = (bookingId) => {
    fetch(`http://localhost:8080/bookings/cancel/${bookingId}`, {
      method: "DELETE",
    })
      .then(() => {
        setBookings(bookings.filter((b) => b.id !== bookingId));
      })
      .catch((error) => console.error("Error canceling booking:", error));
  };

  const handleRescheduleBooking = (booking) => {
    setCurrentBooking(booking);
    setShowModal(true);
  };

  const handleSubmitReschedule = () => {
    fetch(`http://localhost:8080/bookings/updateDateTime/${currentBooking.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, time: newTime }),
    })
      .then(() => {
        setBookings(
          bookings.map((b) =>
            b.id === currentBooking.id ? { ...b, date: newDate, time: newTime } : b
          )
        );
      })
      .catch((error) => console.error("Error rescheduling:", error));
    setShowModal(false);
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        <h3 className="text-center text-primary mb-4">My Bookings</h3>

        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Card key={booking.id} className="mb-3 shadow-lg border-0 rounded bg-light">
              <Card.Body>
                <h5>
                  {booking.serviceProvider?.serviceName || "Service Name Not Available"} with{" "}
                  <span className="fw-bold">{booking.serviceProvider?.user?.fullName || "Provider Name Not Available"}</span>
                </h5>
                <p>
                  <strong>Date:</strong> {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A"} |
                  <strong> Time:</strong> {booking.bookingDate ? new Date(booking.bookingDate).toLocaleTimeString() : "N/A"} |
                  <strong> Price:</strong> ${booking.serviceProvider?.price || "N/A"} |
                  <strong> Status:</strong> {booking.status || "N/A"}
                </p>

                <div className="d-flex gap-2">
                  <Button variant="warning" onClick={() => handleRescheduleBooking(booking)}>
                    Reschedule
                  </Button>
                  <Button variant="danger" onClick={() => handleCancelBooking(booking.id)}>
                    Cancel
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="text-center text-danger">No active bookings found.</p>
        )}

        {/* Reschedule Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Reschedule Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formDate">
                <Form.Label>New Date</Form.Label>
                <Form.Control type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formTime" className="mt-3">
                <Form.Label>New Time</Form.Label>
                <Form.Control type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmitReschedule}>
              Reschedule
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default MyBookings;
