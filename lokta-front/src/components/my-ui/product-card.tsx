// src/components/ProductCard.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand-stores/auth.store";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  originalPrice: number;
  owner_id: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  title,
  originalPrice,
  owner_id,
}) => {
  const myId = useAuthStore((state) => state.user?.id);
  const navigate = useNavigate();
  const handleChatWithSeller = async () => {
    navigate("/chat/" + owner_id);
  };

  return (
    <div
      dir="rtl"
      className="bg-white border border-gray-200 rounded-lg 
      overflow-hidden shadow-md
           w-[320px] md:w-[200px] h-[300px]"
    >
      {/* Image - Smaller aspect ratio on mobile */}
      <div className="relative w-full h-[60%] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain rounded-t-lg transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Content - Smaller padding on mobile */}
      <div className="p-1.5 xs:p-2 sm:p-3 flex-grow flex flex-col">
        {/* Title - Smaller font on mobile */}
        <h3 className="text-[10px] xs:text-xs sm:text-sm font-semibold mb-0.5 xs:mb-1 sm:mb-2 line-clamp-2 text-right">
          {title}
        </h3>

        {/* Prices - Smaller font on mobile */}
        <div className="flex items-center mb-0.5 xs:mb-1 sm:mb-2">
          <span className="text-xs xs:text-sm sm:text-base font-bold text-blue-500">
            {originalPrice.toFixed(2)}$
          </span>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        {/* Button - Smaller on mobile */}
        {myId !== owner_id && (
          <div className="mt-0.5 xs:mt-1 sm:mt-2">
            <Button
              onClick={handleChatWithSeller}
              className="w-full cursor-pointer text-[8px] xs:text-[10px] sm:text-xs flex items-center justify-center h-5 xs:h-6 sm:h-7 px-1 xs:px-2"
              variant="outline"
              size="sm"
            >
              <MessageCircle className="ml-0.5 h-2 w-2 xs:h-3 xs:w-3 sm:h-4 sm:w-4" />
              <span>مراسلة البائع</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
