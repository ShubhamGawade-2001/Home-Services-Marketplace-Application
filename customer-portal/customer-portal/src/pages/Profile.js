import React, { useEffect, useState } from "react";
import CustomNavbar from "../components/Navbar";
import { Container, Form, Button, ListGroup, Modal, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    name: "User",
    email: "user@example.com",
    address: "Not provided",
    password: "********",
  });

  const [bookings, setBookings] = useState([]);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        fetchUserProfile(parsedUser.id);
        fetchBookingHistory(parsedUser.id);
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

  const fetchBookingHistory = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/bookings/history/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch booking history");

      let bookingData = await response.json();

      const disputesResponse = await fetch("http://localhost:8080/disputes");
      const disputes = disputesResponse.ok ? await disputesResponse.json() : [];
      const disputeMap = new Map(disputes.map((d) => [d.bookingId, d]));

      const updatedBookings = bookingData.map((booking) => {
        const dispute = disputeMap.get(booking.id);
        return {
          ...booking,
          disputeId: dispute ? dispute.id : null,
          disputeStatus: dispute ? dispute.status : null,
        };
      });

      setBookings(updatedBookings);
    } catch (error) {
      console.error("Error fetching booking history:", error);
    }
  };

  const handleRaiseDispute = async () => {
    if (!disputeReason.trim()) {
      alert("Please provide a reason for the dispute.");
      return;
    }

    if (!selectedBooking) {
      alert("No booking selected for dispute.");
      return;
    }

    const disputePayload = {
      bookingId: selectedBooking.id,
      provider: selectedBooking.serviceProvider.user.fullName,
      customer: user.name,
      description: disputeReason,
    };

    try {
      const response = await fetch(`http://localhost:8080/disputes/raise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(disputePayload),
      });

      if (!response.ok) throw new Error("Failed to raise dispute");

      const newDispute = await response.json();

      alert("Dispute raised successfully!");
      setShowDisputeModal(false);
      setDisputeReason("");

      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id
            ? { ...b, disputeId: newDispute.id, disputeStatus: newDispute.status }
            : b
        )
      );
    } catch (error) {
      console.error("Error raising dispute:", error);
    }
  };

  return (
    <>
      <CustomNavbar />
      <Container className="d-flex justify-content-center align-items-start mt-5 gap-4 flex-wrap">
        <Card className="p-4 shadow-lg bg-warning" style={{ maxWidth: "500px", width: "100%" }}>
          <h3 className="text-center">Profile</h3>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={user.email} disabled />
            </Form.Group>
            <Form.Group controlId="address" className="mt-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                value={user.address}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Card>
      </Container>

      <Container className="mt-5">
        <h3 className="text-center mb-4">Booking History</h3>
        {bookings.length === 0 ? (
          <p className="text-center">No completed or cancelled bookings yet.</p>
        ) : (
          <ListGroup>
            {bookings.map((booking) => (
              <ListGroup.Item key={booking.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Service:</strong> {booking.serviceProvider.serviceName} <br />
                  <strong>Provider:</strong> {booking.serviceProvider.user.fullName} <br />
                  <strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                </div>

                <div className="d-flex flex-column align-items-end">
                  {booking.disputeStatus ? (
                    <span
                      className={`fw-bold ${booking.disputeStatus === "RESOLVED" ? "text-success" : "text-danger"}`}
                    >
                      Dispute Status: {booking.disputeStatus}
                    </span>
                  ) : (
                    <Button
                      variant="warning"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowDisputeModal(true);
                      }}
                    >
                      Raise Dispute
                    </Button>
                  )}
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Container>

      <Modal show={showDisputeModal} onHide={() => setShowDisputeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Raise a Dispute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="disputeReason">
              <Form.Label>Reason for Dispute</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDisputeModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRaiseDispute}>
            Submit Dispute
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Profile;
