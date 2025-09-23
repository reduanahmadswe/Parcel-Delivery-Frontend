import { Star } from "lucide-react";
import React from "react";

interface RatingStarsProps {
  rating?: number;
  onRate?: (rating: number) => void;
  interactive?: boolean;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRate,
  interactive = false,
}) => {
  if (!rating && !interactive) return null;

  const handleStarClick = (starRating: number) => {
    if (interactive && onRate) {
      onRate(starRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`${
            interactive
              ? "hover:scale-125 transition-transform cursor-pointer"
              : "cursor-default"
          }`}
          onClick={() => handleStarClick(star)}
          disabled={!interactive}
        >
          <Star
            className={`w-3 h-3 ${
              rating && star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            } ${
              interactive ? "hover:text-yellow-400 hover:fill-yellow-400" : ""
            }`}
          />
        </button>
      ))}
      {rating && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          ({rating}/5)
        </span>
      )}
    </div>
  );
};

export default RatingStars;

