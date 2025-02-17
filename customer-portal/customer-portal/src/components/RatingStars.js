// src/components/RatingStars.js

import React, { useState } from 'react';

const RatingStars = ({ rating, onRate }) => {
  const [currentRating, setCurrentRating] = useState(rating);

  const handleMouseOver = (index) => {
    setCurrentRating(index + 1);
  }

  const handleMouseOut = () => {
    setCurrentRating(rating);
  }

  const handleClick = (index) => {
    onRate(index + 1);  // Call the onRate function passed as prop
  }

  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={`star ${currentRating > index ? 'filled' : ''}`}
          onMouseOver={() => handleMouseOver(index)}
          onMouseOut={handleMouseOut}
          onClick={() => handleClick(index)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingStars;
