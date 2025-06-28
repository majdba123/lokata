import { Offer } from "@/api/services/offers/offers.types";
import React from "react";

interface OfferItemProps {
  offer: Offer;
  isSelected: boolean;
  onSelect: (offerId: string) => void;
}

const OfferItem: React.FC<OfferItemProps> = ({
  offer,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      key={offer.id}
      onClick={() => onSelect(String(offer.id))}
      className={`
        border rounded-lg p-4 cursor-pointer transition-all duration-200 ease-in-out
        hover:shadow-md hover:border-blue-500
        ${
          isSelected
            ? "border-blue-600 ring-2 ring-blue-300 bg-blue-50"
            : "border-gray-300 bg-white"
        }
      `}
    >
      <h4 className="font-semibold text-md mb-1">{offer.title}</h4>
      <p className="text-sm text-gray-600 mb-2">
        المدة: {offer.count_month} يوم
      </p>
      <p className="text-lg font-bold text-blue-700">
        {Number(offer.price) === 0 ? "مجاني" : `${offer.price} ل.س`}
      </p>
    </div>
  );
};

export default OfferItem;
