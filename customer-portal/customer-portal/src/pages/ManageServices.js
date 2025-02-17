import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Table, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ManageServices = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newService, setNewService] = useState({
        serviceName: "",
        category: "",
        price: "",
        availability: true,
    });
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    const storedUser = localStorage.getItem("user");
    const userData = JSON.parse(storedUser);
    const userId = userData.id;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/service/provider/${userId}`);
                setServices(response.data);
            } catch (err) {
                setError("Failed to fetch services.");
                console.error("Error fetching services:", err);
            }
        };
        fetchServices();
    }, []);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setNewService({ serviceName: "", category: "", price: "", availability: true });
        setValidationErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService((prevState) => ({ ...prevState, [name]: value }));
    };

    const validateForm = () => {
        let errors = {};
        if (!newService.serviceName || newService.serviceName.trim().length < 3) {
            errors.serviceName = "Service Name must be at least 3 characters.";
        }
        if (!newService.category || newService.category.trim().length === 0) {
            errors.category = "Category is required.";
        }
        if (!newService.price || isNaN(newService.price) || parseFloat(newService.price) <= 0) {
            errors.price = "Price must be a positive number.";
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddService = async () => {
        if (!validateForm()) return;
        const serviceData = {
            serviceName: newService.serviceName,
            category: newService.category,
            price: parseFloat(newService.price),
            availability: newService.availability ? "AVAILABLE" : "UNAVAILABLE",
            user: { id: userId }
        };
        try {
            const response = await axios.post("http://localhost:8080/service/add", serviceData, {
                headers: { "Content-Type": "application/json" }
            });
            setServices([...services, response.data]);
            handleCloseModal();
        } catch (err) {
            setError("Failed to add service.");
            console.error("Error adding service:", err);
        }
    };

    const handleDeleteService = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/service/delete/${id}`);
            setServices(services.filter((service) => service.id !== id));
        } catch (err) {
            setError("Failed to delete service.");
            console.error("Error deleting service:", err);
        }
    };

    const toggleAvailability = async (id, currentAvailability) => {
        try {
            const newAvailability = currentAvailability === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
            await axios.put(`http://localhost:8080/service/toggle/${id}`, { availability: newAvailability }, {
                headers: { "Content-Type": "application/json" }
            });
            setServices(services.map((service) =>
                service.id === id ? { ...service, availability: newAvailability } : service
            ));
        } catch (err) {
            setError("Failed to update availability.");
            console.error("Error updating availability:", err);
        }
    };

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Button variant="outline-dark" onClick={() => navigate(-1)}>⬅ Back</Button>
                <h2 className="text-primary fw-bold">Manage Your Services</h2>
                <Button variant="primary" onClick={handleShowModal}>Add New Service</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive className="mt-4 shadow-lg">
                <thead className="bg-light">
                    <tr>
                        <th>Service Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Availability</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {services.length > 0 ? (
                        services.map((service) => (
                            <tr key={service.id}>
                                <td>{service.serviceName}</td>
                                <td>{service.category}</td>
                                <td>${service.price.toFixed(2)}</td>
                                <td className={`text-${service.availability === "AVAILABLE" ? "success" : "danger"}`}>{service.availability}</td>
                                <td>
                                    <Button variant="warning" onClick={() => toggleAvailability(service.id, service.availability)}>
                                        Toggle
                                    </Button>
                                    <Button variant="danger" className="ms-2" onClick={() => handleDeleteService(service.id)}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">No services available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Add Service Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Service</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formServiceName">
                            <Form.Label>Service Name</Form.Label>
                            <Form.Control type="text" name="serviceName" value={newService.serviceName} onChange={handleInputChange} placeholder="Enter service name" />
                        </Form.Group>
                        <Form.Group controlId="formCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control type="text" name="category" value={newService.category} onChange={handleInputChange} placeholder="Enter service category" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handleAddService}>Add Service</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ManageServices;
