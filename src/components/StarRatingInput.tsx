
import React, { useState } from 'react';

export const StarRatingInput: React.FC<{ rating: number, setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((starIndex) => (
                <button
                    type="button"
                    key={starIndex}
                    className={`text-4xl transition-colors duration-200 ${starIndex <= (hover || rating) ? 'text-yellow-400' : 'text-gray-600'}`}
                    onClick={() => setRating(starIndex)}
                    onMouseEnter={() => setHover(starIndex)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`Rate ${starIndex} out of 5 stars`}
                >
                    &#9733;
                </button>
            ))}
        </div>
    );
};
