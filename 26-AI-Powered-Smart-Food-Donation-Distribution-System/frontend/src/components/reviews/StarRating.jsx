import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 5, maxRating = 5, size = 16, interactive = false, onRatingChange }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = rating >= starValue;
        const isHalf = !isFilled && rating >= starValue - 0.5;

        return (
          <Star
            key={i}
            size={size}
            style={{
              cursor: interactive ? 'pointer' : 'default',
              fill: isFilled ? '#f59e0b' : isHalf ? '#f59e0b' : 'transparent',
              color: isFilled || isHalf ? '#f59e0b' : 'var(--text-dim)',
              transition: 'transform 0.15s ease',
            }}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
