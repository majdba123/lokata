import { PaymentWayInput } from "@/api/services/payment-ways/payment-ways.types";
import React, { ChangeEvent } from "react";

interface PaymentInputRendererProps {
  inputItem: PaymentWayInput;
  value: string | File | null | undefined;
  onInputChange: (inputId: string, value: string) => void;
  onFileChange: (inputId: string, event: ChangeEvent<HTMLInputElement>) => void;
}

const PaymentInputRenderer: React.FC<PaymentInputRendererProps> = ({
  inputItem,
  value,
  onInputChange,
  onFileChange,
}) => {
  return (
    <div key={inputItem.id}>
      {/* Text or Tel Input */}
      {(inputItem.type === "0" || inputItem.type === "1") && (
        <div>
          <label
            htmlFor={`payment_input_${inputItem.id}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            <span className="text-red-500 mr-1">*</span>
            {inputItem.name}
          </label>
          <input
            type={inputItem.type === "1" ? "tel" : "text"}
            id={`payment_input_${inputItem.id}`}
            placeholder={`${inputItem.name}`}
            pattern={inputItem.type === "1" ? "[0-9]{10}" : undefined}
            className="border border-gray-300 rounded-md p-2 w-full text-sm focus:ring-purple-500 focus:border-purple-500"
            value={(value as string) ?? ""}
            onChange={(e) => onInputChange(String(inputItem.id), e.target.value)}
            onClick={(e) => e.stopPropagation()} // Prevent card click
          />
        </div>
      )}
      {/* File Input */}
      {inputItem.type === "2" && (
        <div className="text-center">
          <label
            htmlFor={`payment_input_${inputItem.id}`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            <span className="text-red-500 mr-1">*</span>
            {inputItem.name}
          </label>
          <label
            htmlFor={`payment_input_${inputItem.id}`}
            className={`inline-block px-4 py-2 text-sm rounded-md border bg-purple-100 border-purple-400 hover:bg-purple-200 cursor-pointer w-full truncate`}
          >
            {value instanceof File
              ? value.name
              : `اختر ملف ${inputItem.name}`}
          </label>
          <input
            type="file"
            id={`payment_input_${inputItem.id}`}
            accept="image/*"
            className="hidden"
            onChange={(e) => onFileChange(String(inputItem.id), e)}
            onClick={(e) => e.stopPropagation()} // Prevent card click
          />
        </div>
      )}
    </div>
  );
};

export default PaymentInputRenderer;
