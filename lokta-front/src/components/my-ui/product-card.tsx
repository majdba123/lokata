// src/components/ProductCard.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { truncateString } from "@/lib/helpers";

interface ProductCardProps {
  imageUrl: string;
  title: string;
  originalPrice: number;
  owner_id: number;
  currency: "sy" | "us";
  description: string;
  id: number | string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  title,
  originalPrice,
  owner_id,
  currency,
  description,
  id,
}) => {
  const myId = useAuthStore((state) => state.user?.id);
  const [screenSize, setScreenSize] = useState(0);

  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const navigate = useNavigate();
  const handleChatWithSeller = async () => {
    navigate("/chat/" + owner_id);
  };

  return (
    <div
      dir="rtl"
      className="bg-white border border-gray-200 rounded-lg 
      overflow-hidden shadow-md
      w-full max-w-[320px] h-[356px] sm:h-[356px] md:w-[200px] flex flex-col"
    >
      {/* Image - Maintain consistent size */}
      <div className="relative w-full flex-shrink-0 h-[60%] sm:h-[55%] bg-gray-100 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-contain rounded-t-lg transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>

      {/* Content - Adjust padding for smaller screens */}
      <div className="p-2 sm:p-3 flex-grow flex flex-col">
        {/* Title - Adjust font size for smaller screens */}
        <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 line-clamp-2 text-right">
          <Link className="hover:underline" to={"/product/" + id}>
            {title}
          </Link>
        </h3>

        {/* Prices - Adjust font size for smaller screens */}
        <div className="flex items-center mb-1 sm:mb-2">
          <span className="text-sm sm:text-base font-bold text-blue-500">
            {originalPrice.toFixed(2)} {currency == "sy" ? "ل.س" : "$"}
          </span>
        </div>
        <p className="text-xs text-gray-500">
          {screenSize >= 900 ? (
            <span>{truncateString(description, 25)}</span>
          ) : (
            <span>{truncateString(description, 60)}</span>
          )}
        </p>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        {/* Button - Adjust size for smaller screens */}
        {myId !== owner_id ? (
          <div className="mt-1 sm:mt-2">
            <Button
              onClick={handleChatWithSeller}
              className="w-full cursor-pointer text-[10px] sm:text-xs flex items-center justify-center h-6 sm:h-7 px-2 sm:px-3"
              variant="outline"
              size="sm"
            >
              <MessageCircle className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span>مراسلة البائع</span>
            </Button>
          </div>
        ) : (
          <div className="mt-1 sm:mt-2 text-center">
            <p className="text-xs sm:text-sm">منتجك</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
