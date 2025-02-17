import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CustomNavbar from "../components/Navbar";

const SearchServices = () => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState(200);
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/service/services")
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
        setFilteredServices(data);
      })
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/service/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleSearch = () => {
    const filtered = services.filter(
      (service) =>
        (category ? service.category.toLowerCase() === category.toLowerCase() : true) &&
        service.price <= price
    );
    setFilteredServices(filtered);
  };

  const handleViewDetails = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  return (
    <>
      <CustomNavbar />
      <Container className="mt-4">
        {/* Search Card */}
        <Card className="p-4 shadow-lg border-0 rounded-3 bg-light">
          <Card.Body>
            <h3 className="text-center text-dark mb-4">Search Services</h3>
            <Form>
              <Row className="mb-3">
                <Col md={5}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-dark">Select Category</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="border-secondary bg-white text-dark"
                    >
                      <option value="">Choose...</option>
                      {categories.length > 0 ? (
                        categories.map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        ))
                      ) : (
                        <option disabled>Loading categories...</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label className="fw-bold text-dark">Max Price: ${price}</Form.Label>
                    <Form.Range
                      min={50}
                      max={1000}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="border-secondary"
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button variant="primary" className="w-100 fw-bold" onClick={handleSearch}>
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>


        {/* Services List */}
        <Container className="mt-3">
          <Row>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Col md={4} key={service.id} className="mb-4">
                  <Card className="p-3 shadow-lg border-0 rounded-3 bg-white">
                    <Card.Body>
                      <Card.Title className="fw-bold text-dark">{service.serviceName}</Card.Title>
                      <Card.Text className="text-muted">
                        <strong>Category:</strong> {service.category}
                        <br />
                        <strong>Price:</strong> ${service.price}
                      </Card.Text>
                      <div className="d-flex justify-content-center">
                        <Button
                          variant="outline-primary"
                          className="fw-bold"
                          onClick={() => handleViewDetails(service.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <p className="text-center text-secondary fw-bold fs-5">No services found.</p>
            )}
          </Row>
        </Container>
      </Container>
    </>
  );
};

export default SearchServices;
