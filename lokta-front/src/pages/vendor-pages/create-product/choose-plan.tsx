import React from "react";
import { ProductData } from "./create-product"; // Import the type from the form component

interface ChoosePlanProps {
  productData: ProductData;
  imageUrls: string[] | null;
  onBack: () => void; // Function to go back to the form
  
}

const ChoosePlan: React.FC<ChoosePlanProps> = ({ productData, imageUrls, onBack }) => {
  console.log("Product Data received in ChoosePlan:", productData);
  console.log("Image URLs received in ChoosePlan:", imageUrls);

  // TODO: Implement plan selection logic here.
  // Fetch available plans, display them, handle user selection.
  // Call the final product creation API with productData, imageUrls, and the selected plan ID.

  return (
    <div dir="rtl" className="mx-auto p-8 w-[100%]">
      <h2 className="text-2xl font-semibold mb-6 text-center">اختر خطة الإعلان</h2>

      {/* Placeholder for plan options */}
      <div className="border border-dashed border-gray-400 p-10 rounded-lg text-center text-gray-500">
        <p>سيتم عرض خيارات خطط الإعلان هنا.</p>
        <p>(تحتاج إلى جلب وعرض الخطط المتاحة)</p>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="bg-gray-500 text-white rounded-md py-2 px-4 hover:bg-gray-600 transition duration-200">
          العودة لتعديل المنتج
        </button>
        {/* This button will eventually trigger the final submission */}
        <button className="bg-green-500 text-white rounded-md py-2 px-4 hover:bg-green-600 transition duration-200 disabled:opacity-50" disabled> {/* Disabled until plan is selected */}
          تأكيد وإنشاء المنتج بالخطة
        </button>
      </div>
    </div>
  );
};

export default ChoosePlan;