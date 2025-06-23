import React, { useState, ChangeEvent, useEffect, useMemo } from "react";
import { ProductData } from "./create-product"; // Import the type from the form component
import Loading from "@/components/my-ui/loading";
import usePaymentsWayQuery from "./hooks/usePaymentsWayQuery";
import useOffersQuery from "./hooks/useOffersQuery";
import { PaymentWay } from "@/api/services/payment-ways/payment-ways.types";
import { toast } from "sonner";
import useCreateProductMutation from "./hooks/useCreateProductMutation";
import { Offer } from "@/api/services/offers/offers.types";
import OfferItem from "./offer-item";
import PaymentWayItem from "./payment-way-item";
import ActionButtons from "./action-buttons";
import { useNavigate } from "react-router-dom";

interface ChoosePlanProps {
  productData: ProductData;
  imageFiles: File[] | null;
  onBack: () => void;
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
  const [selectedPaymentWayDetails, setSelectedPaymentWayDetails] =
    useState<PaymentWay | null>(null);
  const [paymentInputValues, setPaymentInputValues] = useState<
    Record<string, string | File | null>
  >({});
  const [paymentInputErrors, setPaymentInputErrors] = useState<
    Record<string, string | null>
  >({}); // New state for input errors

  const navigate = useNavigate();

  const selectedOffer = useMemo(() => {
    return offersQuery.data?.find(
      (offer) => String(offer.id) === selectedOfferId
    );
  }, [selectedOfferId, offersQuery.data]);

  const isFreeOfferSelected = useMemo(() => {
    return selectedOffer ? Number(selectedOffer.price) === 0 : false;
  }, [selectedOffer]);

  useEffect(() => {
    if (isFreeOfferSelected) {
      setSelectedPaymentWayId(null);
      setSelectedPaymentWayDetails(null);
      setPaymentInputValues({});
      setPaymentInputErrors({}); // Clear errors when switching to free offer
    }
  }, [isFreeOfferSelected]);

  const handleInputChange = (inputId: string, value: string) => {
    setPaymentInputValues((prev) => ({
      ...prev,
      [inputId]: value,
    }));
    setPaymentInputErrors((prev) => ({ ...prev, [inputId]: null })); // Clear error on change
  };

  const handleFileChange = (
    inputId: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setPaymentInputValues((prev) => ({
        ...prev,
        [inputId]: event.target.files![0],
      }));
    } else {
      setPaymentInputValues((prev) => ({
        ...prev,
        [inputId]: null,
      }));
    }
    setPaymentInputErrors((prev) => ({ ...prev, [inputId]: null })); // Clear error on file change
  };

  // Function to validate payment inputs and return errors
  const validatePaymentInputs = (): Record<string, string | null> => {
    const errors: Record<string, string | null> = {};

    if (!isFreeOfferSelected && selectedPaymentWayDetails) {
      selectedPaymentWayDetails.paymentway_input.forEach((inputItem) => {
        const value = paymentInputValues[inputItem.id];

        // Check for emptiness
        if (value === null || value === undefined || value === "") {
          errors[inputItem.id] = `${inputItem.name} مطلوب.`;
          return; // Move to the next input
        }

        // Validate phone number input (assuming type "1" is phone)
        if (inputItem.type === "1") {
          // "1" for tel type as in PaymentInputRenderer
          const phoneRegex = /^\d{10}$/;
          if (typeof value === "string" && !phoneRegex.test(value)) {
            errors[inputItem.id] = "رقم الهاتف يجب أن يتكون من 10 أرقام.";
          } else {
            errors[inputItem.id] = null; // Clear error if valid
          }
        }
      });
    }
    return errors;
  };

  const handleFinalSubmit = async () => {
    if (!productData || !selectedOfferId) {
      toast.error("يرجى اختيار عرض أولاً.");
      return;
    }

    if (!isFreeOfferSelected) {
      if (!selectedPaymentWayId || !selectedPaymentWayDetails) {
        toast.error("يرجى اختيار طريقة دفع أولاً.");
        return;
      }
      const errors = validatePaymentInputs();
      setPaymentInputErrors(errors); // Set errors state
      if (Object.values(errors).some((error) => error !== null)) {
        toast.error("يرجى تصحيح الأخطاء في حقول الدفع."); // Generic error toast
        return;
      }
    }

    const formData = new FormData();

    formData.append("title", productData.productTitle);
    formData.append("description", productData.productDescription);
    formData.append("price", String(productData.productPrice));
    formData.append("sub__category_id", String(productData.sub__category_id));
    formData.append("brand_id", String(productData.brand_id));
    formData.append("currency", productData.currency);
    formData.append("city", productData.city);

    if (imageFiles) {
      imageFiles.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }

    formData.append("offer_id", selectedOfferId);

    if (isFreeOfferSelected) {
      formData.append("paymentway_id", "1");
    } else {
      formData.append("paymentway_id", selectedPaymentWayId!);

      selectedPaymentWayDetails!.paymentway_input.forEach((inputItem) => {
        const value = paymentInputValues[inputItem.id];
        if (value !== null && value !== undefined) {
          formData.append(`payment_inputs[${inputItem.name}]`, value);
        }
      });
    }
    createProductMutation.mutate(formData, {
      onError: (error) => toast.error(error.message),
      onSuccess: () => {
        toast.success("تم إنشاء المنتج بنجاح", {
          description:
            "لقد اكتمل الطلب وسوف يتم قريبا نشر الاعلان بعد التاكد من صحة البيانت",
          duration: 6000,
          position: "top-center",
        });
        navigate("/profile/my-products");
      },
    });
  };

  // Determine if there are any active payment input errors
  const hasPaymentInputErrors = useMemo(() => {
    return Object.values(paymentInputErrors).some((error) => error !== null);
  }, [paymentInputErrors]);

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
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                اختر العرض المناسب
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {offersQuery.data?.map((offer: Offer) => (
                  <OfferItem
                    key={offer.id}
                    offer={offer}
                    isSelected={selectedOfferId === String(offer.id)}
                    onSelect={setSelectedOfferId}
                  />
                ))}
              </div>
            </div>

            {!isFreeOfferSelected && selectedOfferId && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  اختر طريقة الدفع
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paymentsWayQuery.data
                    ?.filter((paymentWay) => paymentWay.status === 1)
                    .map((paymentWay: PaymentWay) => (
                      <PaymentWayItem
                        key={paymentWay.id}
                        paymentWay={paymentWay}
                        isSelected={
                          selectedPaymentWayId === String(paymentWay.id)
                        }
                        onSelect={(selectedPW: any) => {
                          setSelectedPaymentWayId(String(selectedPW.id));
                          setSelectedPaymentWayDetails(selectedPW);
                        }}
                        paymentInputValues={paymentInputValues}
                        onInputChange={handleInputChange}
                        paymentInputErrors={paymentInputErrors} // Pass errors down
                        onFileChange={handleFileChange}
                      />
                    ))}
                </div>
              </div>
            )}

            <ActionButtons
              onBack={onBack}
              onSubmit={handleFinalSubmit}
              isSubmitting={createProductMutation.isPending}
              isSubmitDisabled={
                !selectedOfferId ||
                (!isFreeOfferSelected &&
                  (!selectedPaymentWayId || hasPaymentInputErrors)) // Check hasPaymentInputErrors
              }
            />
          </div>
        )}
    </div>
  );
};

export default ChoosePlan;
