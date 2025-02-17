import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ServiceCard = ({ provider }) => {
  return (
    <div className="col-sm-6 col-md-4 col-lg-3 mb-3">
      {" "}
      {/* Smaller grid size */}
      <div className="card shadow-lg border-0 p-2 service-card border-2">
        <img
          src={provider.image}
          className="card-img-top service-card-img rounded"
          alt={provider.name}
          style={{ height: "200px", objectFit: "fill" }} // Smaller image size
        />
        <div className="card-body p-2">
          <h6 className="card-title text-truncate">{provider.name}</h6>{" "}
          {/* Smaller text */}
          <p className="card-text small mb-1">{provider.category}</p>{" "}
          {/* Smaller font */}
          <p className="card-text small mb-1">
            <strong>Price:</strong> ${provider.price}
          </p>
          <p className="card-text small mb-2">
            <strong>Rating:</strong> {provider.rating} ⭐
          </p>
          <Link
            to={`/service/${provider.id}`}
            className="btn btn-sm btn-primary w-100"
          >
            {provider.name}
          </Link>{" "}
          {/* Small button */}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
