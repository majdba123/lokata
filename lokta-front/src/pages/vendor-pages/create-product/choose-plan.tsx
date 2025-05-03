import React from "react";
import { ProductData } from "./create-product"; // Import the type from the form component
import { useQuery } from "@tanstack/react-query";
import { getAllPaymentWaysApi } from "@/api/services/payment-ways/payment-way.service";
import Loading from "@/components/my-ui/loading";

interface ChoosePlanProps {
  productData: ProductData;
  imageUrls: string[] | null;
  onBack: () => void; // Function to go back to the form
}

const ChoosePlan: React.FC<ChoosePlanProps> = ({ onBack }) => {
  const { data, status } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => getAllPaymentWaysApi(),
    retry: 0,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  return (
    <div dir="rtl" className="mx-auto p-8 w-[100%]">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        اختر خطة الإعلان
      </h2>

      {/* Placeholder for plan options */}
      <div className="border border-dashed border-gray-400 p-10 rounded-lg text-center text-gray-500">
        <p>سيتم عرض خيارات خطط الإعلان هنا.</p>
      </div>
      {status == "pending" && <Loading />}

      {status == "success" && (
        <div className="flex justify-between mt-8">
          <div className="flex gap-4 flex-col md:flex-row w-full">vfv</div>
          <div className="flex gap-4 flex-col md:flex-row w-full">
            <button
              onClick={onBack}
              className="bg-gray-500 text-white rounded-md py-2 px-4 hover:bg-gray-600 transition duration-200"
            >
              العودة لتعديل المنتج
            </button>
            {/* This button will eventually trigger the final submission */}
            <button
              className="bg-green-500 text-white rounded-md py-2 px-4 hover:bg-green-600 transition duration-200 disabled:opacity-50"
              disabled
            >
              {" "}
              {/* Disabled until plan is selected */}
              تأكيد وإنشاء المنتج بالخطة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoosePlan;
