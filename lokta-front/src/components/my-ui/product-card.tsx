// src/components/ProductCard.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Star } from "lucide-react";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  hasDiscountLabel: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  title,
  originalPrice,
  discountPrice,
  discountPercentage,
  hasDiscountLabel,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
      {/* Image */}
      <div className="relative aspect-w-4 aspect-h-3">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-t-lg"
        />
        {hasDiscountLabel && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}
        <Button variant="ghost" size="icon" className="absolute top-2 right-2">
          <Heart className="h-4 w-4" strokeWidth={3} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>

        {/* Prices */}
        <div className="flex items-center mb-2">
          <span className="text-lg font-bold text-blue-500">
            ${discountPrice.toFixed(2)}
          </span>
          {discountPercentage > 0 && (
            <span className="text-sm text-gray-500 line-through ml-2">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stars */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              strokeWidth={3}
              key={i}
              className="text-yellow-400 h-4 w-4 mr-1"
            />
          ))}
          <span className="text-sm text-gray-500">(5.0)</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
