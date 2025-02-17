import React, { useEffect, useState } from 'react';
import { Modal, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BookingRequests.css';

const BookingRequests = () => {
    const navigate = useNavigate();
    const [bookingRequests, setBookingRequests] = useState([]);
    const [error, setError] = useState(null);

    const storedUser = localStorage.getItem("user");
    const userData = JSON.parse(storedUser);
    const providerId = userData.id;

    // Fetch only pending and accepted bookings
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/bookings/provider/${providerId}`);
                const filteredBookings = response.data.filter(
                    (booking) => booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED'
                );
                setBookingRequests(filteredBookings);
            } catch (err) {
                setError("Failed to fetch booking requests.");
                console.error("Error fetching bookings:", err);
            }
        };
        fetchBookings();
    }, []); // ✅ Removed dependency to prevent infinite loop

    // Function to handle Accept, Reject, Completed, Cancel actions
    const handleAction = async (booking, status) => {
        try {
            await axios.put(
                `http://localhost:8080/bookings/update/${booking.id}`,
                null,
                { params: { status: status.toUpperCase() } }
            );

            // ✅ Update UI after status change
            setBookingRequests((prevRequests) =>
                prevRequests.filter((b) => b.id !== booking.id)
            );

            alert(`Booking ${status.toUpperCase()} for ${booking.customer.fullName}`);
        } catch (err) {
            setError(`Failed to update booking status.`);
            console.error("Error updating booking status:", err);
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-start mb-3">
                <Button variant="outline-dark" onClick={() => navigate(-1)}>⬅ Back</Button>
            </div>

            <h3 className="text-center fw-bold text-primary">Booking Requests</h3>
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="justify-content-center mt-4">
                {bookingRequests.length > 0 ? (
                    bookingRequests.map((booking) => (
                        <Col md={6} key={booking.id} className="mb-4">
                            <Card className="p-3 shadow-lg border-0 rounded-4">
                                <Card.Body>
                                    <h5 className="fw-bold">{booking.customer.fullName}</h5>
                                    <p><strong>Service:</strong> {booking.serviceProvider.serviceName}</p>
                                    <p><strong>Date & Time:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
                                    <p><strong>Address:</strong> {booking.customer.address}</p>
                                    <p><strong>Status:</strong> 
                                        <span className={`text-${booking.status === 'PENDING' ? 'warning' : 'success'}`}>
                                            {booking.status}
                                        </span>
                                    </p>
                                    <div className="d-flex gap-2">
                                        {booking.status === 'PENDING' && (
                                            <>
                                                <Button variant="success" onClick={() => handleAction(booking, 'ACCEPTED')}>Accept</Button>
                                                <Button variant="danger" onClick={() => handleAction(booking, 'REJECTED')}>Reject</Button>
                                            </>
                                        )}
                                        {booking.status === 'ACCEPTED' && (
                                            <>
                                                <Button variant="primary" onClick={() => handleAction(booking, 'COMPLETED')}>Mark as Completed</Button>
                                                <Button variant="warning" onClick={() => handleAction(booking, 'CANCELLED')}>Cancel</Button>
                                            </>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col md={6}>
                        <p className="text-center text-muted">No booking requests found.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default BookingRequests;
