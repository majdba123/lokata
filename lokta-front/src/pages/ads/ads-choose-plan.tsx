import React, { useState, ChangeEvent, useEffect, useMemo } from "react";
import Loading from "@/components/my-ui/loading";
import { PaymentWay } from "@/api/services/payment-ways/payment-ways.types";
import usePaymentsWayQuery from "../vendor-pages/create-product/hooks/usePaymentsWayQuery";
import useAdsPlansQuery from "./hooks/useAdsPlansQuery";
import PaymentWayItem from "../vendor-pages/create-product/payment-way-item";
import ActionButtons from "../vendor-pages/create-product/action-buttons";
import { toast } from "sonner";
import useCreateAdsMutation from "./hooks/useCreateAdsMutation";
import { useNavigate } from "react-router-dom";
type AdsPlanElement = {
  title: string;
  level: number;
  discription: string;
  count_month: number;
  price: number;
  updated_at: string;
  created_at: string;
  id: number;
};

type Props = {
  backToForm: () => void;
  adsData: { image: FileList; adLink: string };
};

const AdsChoosePlan: React.FC<Props> = ({ backToForm, adsData }) => {
  const paymentsWayQuery = usePaymentsWayQuery();
  const adsPlansQuery = useAdsPlansQuery();
  const createAdsMutation = useCreateAdsMutation();
  const navigate = useNavigate();

  const [selectedAdsPlanId, setSelectedAdsPlanId] = useState<string | null>(
    null
  );
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
  >({});

  const selectedPlan = useMemo(() => {
    return adsPlansQuery.data?.find(
      (plan) => String(plan.id) === selectedAdsPlanId
    );
  }, [selectedAdsPlanId, adsPlansQuery.data]);

  const isFreePlanSelected = useMemo(() => {
    return selectedPlan ? Number(selectedPlan.price) === 0 : false;
  }, [selectedPlan]);

  useEffect(() => {
    if (isFreePlanSelected) {
      setSelectedPaymentWayId(null);
      setSelectedPaymentWayDetails(null);
      setPaymentInputValues({});
      setPaymentInputErrors({});
    }
  }, [isFreePlanSelected]);

  const handleInputChange = (inputId: string, value: string) => {
    setPaymentInputValues((prev) => ({
      ...prev,
      [inputId]: value,
    }));
    setPaymentInputErrors((prev) => ({ ...prev, [inputId]: null }));
  };

  const handleFileChange = (
    inputId: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setPaymentInputValues((prev) => ({ ...prev, [inputId]: file }));
    setPaymentInputErrors((prev) => ({ ...prev, [inputId]: null }));
  };

  const validatePaymentInputs = (): Record<string, string | null> => {
    const errors: Record<string, string | null> = {};

    if (!isFreePlanSelected && selectedPaymentWayDetails) {
      selectedPaymentWayDetails.paymentway_input.forEach((inputItem) => {
        const value = paymentInputValues[inputItem.id];

        if (!value) {
          errors[inputItem.id] = `${inputItem.name} مطلوب.`;
        } else if (
          inputItem.type === "1" &&
          typeof value === "string" &&
          !/^\d{10}$/.test(value)
        ) {
          errors[inputItem.id] = "رقم الهاتف يجب أن يتكون من 10 أرقام.";
        }
      });
    }

    return errors;
  };

  const handleFinalSubmit = () => {
    if (!adsData || !selectedAdsPlanId) {
      toast.error("يرجى اختيار عرض أولاً.");
      return;
    }

    if (!isFreePlanSelected) {
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
    formData.append("img", adsData.image[0]);
    formData.append("link", adsData.adLink);
    formData.append("plan_id", selectedAdsPlanId);
    if (isFreePlanSelected) {
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

    createAdsMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("تم إنشاء الاعلان بنجاح.");
        navigate("/profile/my-ads");
      },
      onError: (error) => {
        toast.error("حدث خطأ أثناء إنشاء الاعلان. يرجى المحاولة مرة أخرى.");
        console.error("Error creating ad:", error);
      },
    });
  };

  const hasPaymentInputErrors = useMemo(() => {
    return Object.values(paymentInputErrors).some((error) => error !== null);
  }, [paymentInputErrors]);

  return (
    <div dir="rtl" className="mx-auto p-8 w-full">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        اختر خطة الإعلان
      </h2>

      {(adsPlansQuery.status === "pending" ||
        paymentsWayQuery.status === "pending") && <Loading />}

      {adsPlansQuery.status === "success" &&
        paymentsWayQuery.status === "success" && (
          <div className="mt-8 flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                اختر الخطة المناسبة
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {adsPlansQuery.data?.map((plan: AdsPlanElement) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedAdsPlanId(String(plan.id))}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedAdsPlanId === String(plan.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <h4 className="font-bold text-lg">{plan.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {plan.discription}
                    </p>
                    <p className="text-sm">المدة: {plan.count_month} ايام</p>
                    <p className="text-sm font-semibold">
                      السعر: {plan.price} ريال
                    </p>
                    <p className="text-xl text-gray-600 mt-2 ">
                      اعلان {" "}
                      {plan.level == 1 ? "داخلى" : "خارجى"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {!isFreePlanSelected && selectedAdsPlanId && (
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
                        paymentInputErrors={paymentInputErrors}
                        onFileChange={handleFileChange}
                      />
                    ))}
                </div>
              </div>
            )}

            <ActionButtons
              onBack={backToForm}
              onSubmit={handleFinalSubmit}
              isSubmitting={createAdsMutation.isPending}
              isSubmitDisabled={
                !selectedAdsPlanId ||
                (!isFreePlanSelected &&
                  (!selectedPaymentWayId || hasPaymentInputErrors))
              }
              submitText="إنشاء الإعلان"
              submittingText="جاري إنشاء الإعلان..."
              backButtonText="العودة لتعديل الاعلان"
            />
          </div>
        )}
    </div>
  );
};

export default AdsChoosePlan;
