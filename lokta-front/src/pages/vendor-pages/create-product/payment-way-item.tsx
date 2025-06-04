import {
  PaymentWay,
  PaymentWayInput,
} from "@/api/services/payment-ways/payment-ways.types";
import React, { ChangeEvent } from "react";
import PaymentInputRenderer from "./payment-input-renderer";

interface PaymentWayItemProps {
  paymentWay: PaymentWay;
  isSelected: boolean;
  onSelect: (paymentWay: PaymentWay) => void;
  paymentInputValues: Record<string, string | File | null>;
  onInputChange: (inputId: string, value: string) => void;
  paymentInputErrors: Record<string, string | null>; // Added paymentInputErrors prop
  onFileChange: (inputId: string, event: ChangeEvent<HTMLInputElement>) => void;
}

const PaymentWayItem: React.FC<PaymentWayItemProps> = ({
  paymentWay,
  isSelected,
  onSelect,
  paymentInputValues,
  onInputChange,
  paymentInputErrors, // Destructure paymentInputErrors prop
  onFileChange,
}) => {
  return (
    <div
      key={paymentWay.id}
      onClick={() => onSelect(paymentWay)}
      className={`
        border rounded-lg p-4 cursor-pointer transition-all duration-200 ease-in-out
        hover:shadow-md hover:border-purple-500
        ${
          isSelected
            ? "border-purple-600 ring-2 ring-purple-300 bg-purple-50"
            : "border-gray-300 bg-white"
        }
      `}
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          {paymentWay.image && (
            <img
              src={paymentWay.image}
              alt={`${paymentWay.title} icon`}
              className="w-6 h-6 object-contain"
            />
          )}
          <h4 className="font-semibold text-md">{paymentWay.title}</h4>
        </div>
        <p className="text-xs text-gray-500 mb-2">{paymentWay.description}</p>
      </div>

      {isSelected && (
        <div className="mt-3 space-y-3">
          {paymentWay.paymentway_input.map((inputItem: PaymentWayInput) => (
            <PaymentInputRenderer
              key={inputItem.id}
              inputItem={inputItem}
              value={paymentInputValues[inputItem.id]}
              onInputChange={onInputChange}
              onFileChange={onFileChange}
              error={paymentInputErrors[inputItem.id]} // Pass the specific error for this input
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentWayItem;
