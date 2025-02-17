// src/components/BookingList.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const BookingList = ({ bookings, onCancel, onReschedule, onRate }) => {
  return (
    <div>
      <h3>Your Bookings</h3>
      <div className="list-group">
        {bookings.map((booking, index) => (
          <div className="list-group-item" key={index}>
            <h5>{booking.serviceName}</h5>
            <p>{booking.providerName} | {booking.date} | {booking.time}</p>
            <p>Price: ${booking.price}</p>
            <button className="btn btn-danger" onClick={() => onCancel(booking.id)}>Cancel</button>
            <button className="btn btn-warning" onClick={() => onReschedule(booking.id)}>Reschedule</button>
            {booking.status === 'completed' && (
              <button className="btn btn-info" onClick={() => onRate(booking.id)}>Rate & Review</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingList;
