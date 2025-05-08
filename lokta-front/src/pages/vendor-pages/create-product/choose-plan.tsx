import React, { useState, ChangeEvent, useEffect, useMemo } from "react";
import { ProductData } from "./create-product"; // Import the type from the form component
import Loading from "@/components/my-ui/loading";
import usePaymentsWayQuery from "./hooks/usePaymentsWayQuery";
import useOffersQuery from "./hooks/useOffersQuery";
import { PaymentWay } from "@/api/services/payment-ways/payment-ways.types";
import { toast } from "sonner";
import useCreateProductMutation from "./hooks/useCreateProductMutation";

interface ChoosePlanProps {
  productData: ProductData;
  imageFiles: File[] | null;
  onBack: () => void; // Function to go back to the form
}
const ChoosePlan: React.FC<ChoosePlanProps> = ({
  onBack,
  imageFiles,
  productData,
}) => {
  const paymentsWayQuery = usePaymentsWayQuery();
  const offersQuery = useOffersQuery();
  const createProductMutation = useCreateProductMutation();
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [selectedPaymentWayId, setSelectedPaymentWayId] = useState<
    string | null
  >(null);
  // State to hold the details of the selected payment way for easy access to its inputs
  const [selectedPaymentWayDetails, setSelectedPaymentWayDetails] =
    useState<PaymentWay | null>(null);
  const [paymentInputValues, setPaymentInputValues] = useState<
    Record<string, string | File | null>
  >({}); // Key: PaymentWayInput.id, Value: input value

  // Find the selected offer details
  const selectedOffer = useMemo(() => {
    return offersQuery.data?.find(
      (offer) => String(offer.id) === selectedOfferId
    );
  }, [selectedOfferId, offersQuery.data]);

  // Determine if the selected offer is free
  const isFreeOfferSelected = useMemo(() => {
    // Use Number() to handle both numeric 0 and string "0"
    return selectedOffer ? Number(selectedOffer.price) === 0 : false;
  }, [selectedOffer]);

  // Reset payment selection if a free offer is chosen
  useEffect(() => {
    if (isFreeOfferSelected) {
      setSelectedPaymentWayId(null);
      setSelectedPaymentWayDetails(null);
      setPaymentInputValues({});
    }
  }, [isFreeOfferSelected]);

  const handleInputChange = (inputId: string, value: string) => {
    setPaymentInputValues((prev) => ({
      ...prev,
      [inputId]: value,
    }));
  };

  const handleFileChange = (
    inputId: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setPaymentInputValues((prev) => ({
        ...prev,
        [inputId]: event.target.files![0], // Store the File object
      }));
    } else {
      // Handle case where user cancels file selection (optional)
      setPaymentInputValues((prev) => ({
        ...prev,
        [inputId]: null, // Clear the value if no file is selected
      }));
    }
  };

  // Helper function to check if all required payment inputs for the selected method are filled
  const arePaymentInputsValid = (): boolean => {
    // If the offer is free, payment inputs are not relevant/required
    if (isFreeOfferSelected || !selectedPaymentWayDetails) return true;

    return selectedPaymentWayDetails.paymentway_input.every((inputItem) => {
      const value = paymentInputValues[inputItem.id];
      // Check if value exists and is not an empty string (for text/tel) or null (for file)
      return value !== null && value !== undefined && value !== "";
    });
  };

  const handleFinalSubmit = async () => {
    // 1. Validate Offer Selection
    if (!productData || !selectedOfferId) {
      toast.error("يرجى اختيار عرض أولاً.");
      return;
    }

    // 2. Validate Payment Selection (only if offer is not free)
    if (!isFreeOfferSelected) {
      if (!selectedPaymentWayId || !selectedPaymentWayDetails) {
        toast.error("يرجى اختيار طريقة دفع أولاً.");
        return;
      }
      if (!arePaymentInputsValid()) {
        toast.error("يرجى ملء جميع حقول الدفع المطلوبة لطريقة الدفع المختارة.");
        return;
      }
    }

    const formData = new FormData();

    // 1. Append Product Data
    formData.append("title", productData.productTitle);
    formData.append("description", productData.productDescription);
    formData.append("price", String(productData.productPrice)); // FormData values are often strings
    formData.append("sub__category_id", String(productData.sub__category_id));
    formData.append("brand_id", String(productData.brand_id));
    formData.append("currency", productData.currency);
    formData.append("city", productData.city);

    if (imageFiles) {
      imageFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file); // Append File object directly
      });
    }

    // 3. Append Offer ID
    formData.append("offer_id", selectedOfferId);

    // 4. Append Payment Way ID and Inputs (conditionally)
    if (isFreeOfferSelected) {
      formData.append("paymentway_id", "1"); // Hardcode ID 1 for free offers
      // Do not append payment_inputs for free offers
    } else {
      // Append selected payment way ID and inputs for paid offers
      formData.append("paymentway_id", selectedPaymentWayId!); // Non-null assertion safe due to validation above

      selectedPaymentWayDetails!.paymentway_input.forEach((inputItem) => {
        // Non-null assertion safe
        const value = paymentInputValues[inputItem.id];
        if (value !== null && value !== undefined) {
          formData.append(`payment_inputs[${inputItem.name}]`, value); // FormData handles File objects automatically
        }
      });
    }
    createProductMutation.mutate(formData, {
      onError: (error) => toast.error(error.message),
      onSuccess: () => toast.success("تم إنشاء المنتج بنجاح"),
    });
  };

  return (
    <div dir="rtl" className="mx-auto p-8 w-[100%]">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        اختر خطة الإعلان
      </h2>
      {(offersQuery.status == "pending" ||
        paymentsWayQuery.status == "pending") && <Loading />}

      {offersQuery.status === "success" &&
        paymentsWayQuery.status === "success" && (
          <div className="mt-8 flex flex-col gap-6">
            <div>
              {/* Offer Selection Section */}
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                اختر العرض المناسب
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {offersQuery.data?.map(
                  (
                    offer // Assuming the API returns an array directly
                  ) => (
                    <div
                      key={offer.id}
                      onClick={() => setSelectedOfferId(String(offer.id))} // Ensure ID is string if state expects string
                      className={`
                    border rounded-lg p-4 cursor-pointer transition-all duration-200 ease-in-out
                    hover:shadow-md hover:border-blue-500
                    ${
                      selectedOfferId === String(offer.id) // Ensure comparison is correct type
                        ? "border-blue-600 ring-2 ring-blue-300 bg-blue-50"
                        : "border-gray-300 bg-white"
                    }
                  `}
                    >
                      <h4 className="font-semibold text-md mb-1">
                        {offer.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        المدة: {offer.count_month} شهر
                      </p>
                      <p className="text-lg font-bold text-blue-700">
                        {Number(offer.price) === 0
                          ? "مجاني"
                          : `${offer.price} ل.س`}
                      </p>{" "}
                      {/* Assuming currency might be in offer data, else default */}
                      {/* Add more offer details here if needed */}
                    </div>
                  )
                )}
              </div>
              {/* You can add error handling display here if needed */}
            </div>

            {/* Payment Way Selection Section - Conditionally Rendered */}
            {!isFreeOfferSelected &&
              selectedOfferId && ( // Only show if a non-free offer is selected
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    اختر طريقة الدفع
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paymentsWayQuery.data?.map((paymentWay) => (
                      <div
                        key={paymentWay.id}
                        onClick={() => {
                          setSelectedPaymentWayId(String(paymentWay.id));
                          setSelectedPaymentWayDetails(paymentWay); // Store the whole selected payment way object
                        }}
                        className={`
                        border rounded-lg p-4 cursor-pointer transition-all duration-200 ease-in-out
                        hover:shadow-md hover:border-purple-500
                        ${
                          selectedPaymentWayId === String(paymentWay.id)
                            ? "border-purple-600 ring-2 ring-purple-300 bg-purple-50"
                            : "border-gray-300 bg-white"
                        }
                      `}
                      >
                        {/* Main Card Div */}
                        <div className="flex flex-col items-center text-center">
                          {" "}
                          {/* Center content */}
                          <div className="flex items-center justify-center gap-2 mb-1">
                            {" "}
                            {/* Title and Icon */}
                            {paymentWay.image && (
                              <img
                                src={paymentWay.image}
                                alt={`${paymentWay.title} icon`}
                                className="w-6 h-6 object-contain" // Adjust size as needed
                              />
                            )}
                            <h4 className="font-semibold text-md">
                              {paymentWay.title}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            {paymentWay.description}
                          </p>{" "}
                          {/* Description */}
                        </div>
                        {/* Render inputs only if this card is selected */}
                        {selectedPaymentWayId === String(paymentWay.id) && (
                          <div className="mt-3 space-y-3">
                            {paymentWay.paymentway_input.map((inputItem) => (
                              <div key={inputItem.id}>
                                {/* Text Input */}
                                {(inputItem.type === "0" ||
                                  inputItem.type === "1") && (
                                  <div>
                                    <label
                                      htmlFor={`payment_input_${inputItem.id}`}
                                      className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                      <span className="text-red-500 mr-1">
                                        *
                                      </span>
                                      {inputItem.name}
                                    </label>
                                    <input
                                      // Use "tel" for phone numbers (type 1), "text" for type 0
                                      type={
                                        inputItem.type === "1" ? "tel" : "text"
                                      }
                                      id={`payment_input_${inputItem.id}`}
                                      placeholder={`${inputItem.name}`} // e.g., رقم الحساب
                                      pattern={
                                        inputItem.type === "1"
                                          ? "[0-9]{10}"
                                          : undefined
                                      } // Example: 10 digits
                                      className="border border-gray-300 rounded-md p-2 w-full text-sm focus:ring-purple-500 focus:border-purple-500"
                                      value={
                                        (paymentInputValues[
                                          inputItem.id
                                        ] as string) ?? ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          String(inputItem.id),
                                          e.target.value
                                        )
                                      }
                                      onClick={(e) => e.stopPropagation()} // Prevent card click when clicking input
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
                                      <span className="text-red-500 mr-1">
                                        *
                                      </span>
                                      {inputItem.name}{" "}
                                      {/* e.g., صورة الإيصال */}
                                    </label>
                                    <label
                                      htmlFor={`payment_input_${inputItem.id}`}
                                      className={`inline-block px-4 py-2 text-sm rounded-md border bg-purple-100 border-purple-400 hover:bg-purple-200 cursor-pointer w-full truncate`}
                                    >
                                      {paymentInputValues[inputItem.id]
                                        ? (
                                            paymentInputValues[
                                              inputItem.id
                                            ] as File
                                          ).name
                                        : `اختر ملف ${inputItem.name}`}
                                    </label>
                                    <input
                                      type="file"
                                      id={`payment_input_${inputItem.id}`}
                                      accept="image/*" // Only accept images
                                      className="hidden" // Hide the default file input
                                      onChange={(e) =>
                                        handleFileChange(
                                          String(inputItem.id),
                                          e
                                        )
                                      }
                                      onClick={(e) => e.stopPropagation()} // Prevent card click
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={onBack}
                className="bg-gray-500 text-white rounded-md py-2 px-4 hover:bg-gray-600 transition duration-200 w-full sm:w-auto"
              >
                العودة لتعديل المنتج
              </button>
              <button
                className="bg-green-500 text-white rounded-md py-2 px-4 hover:bg-green-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto flex-grow"
                disabled={
                  !selectedOfferId || // Always require an offer
                  createProductMutation.isPending ||
                  (!isFreeOfferSelected && // If not free, require payment way and valid inputs
                    (!selectedPaymentWayId || !arePaymentInputsValid()))
                }
                onClick={handleFinalSubmit} // Add your final submit handler here
              >
                {createProductMutation.isPending
                  ? "جاري إنشاء المنتج..."
                  : "تأكيد وإنشاء المنتج بالخطة"}{" "}
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default ChoosePlan;
