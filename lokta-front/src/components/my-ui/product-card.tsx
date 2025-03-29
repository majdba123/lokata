// src/components/ProductCard.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
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
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md w-[250px] h-[350px] flex flex-col transition-all duration-200 hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={imageUrl || "/placeholder.svg?height=300&width=300"}
          alt={title}
          className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        >
          <Heart className="h-4 w-4" strokeWidth={2.5} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2 text-right">
          {title}
        </h3>

        {/* Prices */}
        <div className="flex items-center mb-2">
          <span className="text-base sm:text-lg font-bold text-blue-500">
            {originalPrice.toFixed(2)}$
          </span>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        {/* Button */}
        {myId !== owner_id && (
          <div className="mt-2">
            <Button
              onClick={handleChatWithSeller}
              className="w-full cursor-pointer text-xs sm:text-sm flex items-center justify-center"
              variant="outline"
              size="sm"
            >
              <MessageCircle className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              مراسلة البائع
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
