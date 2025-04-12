import { createBrandApi } from "@/api/services/brand/brand-service";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type BrandData = {
  brandName: string;
};

function CreateBrand() {
  const [loadingCreateBrand, setLoadingCreateBrand] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrandData>();

  const onSubmit: SubmitHandler<BrandData> = async (data) => {
    try {
      setLoadingCreateBrand(true);
      await createBrandApi(data.brandName);
      toast.success("تم إنشاء العلامة التجارية بنجاح"); // Brand created successfully
      setLoadingCreateBrand(false);
      reset();
    } catch (error: any) {
      toast.error(error?.message);
      setLoadingCreateBrand(false);
    }
  };

 
  return (
    <div dir="rtl" className="mx-auto p-8 w-[100%]">
      {/* code for create new brand (name) , using tailwind and react hook form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="brand-name">اسم العلامة التجارية</label>
        <input
          type="text"
          id="brand-name"
          {...register("brandName", {
            required: "اسم العلامة التجارية مطلوب", // Brand name is required
          })}
          className="border border-gray-300 rounded-md p-2"
          placeholder="أدخل اسم العلامة التجارية" // Enter Brand Name
        />
        {errors.brandName && (
          <span className="text-red-500 text-sm">
            {errors.brandName.message}
          </span>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
          disabled={loadingCreateBrand}
        >
          {loadingCreateBrand ? "جاري التحميل..." : "إنشاء العلامة التجارية"}
        </button>
      </form>
    </div>
  );
}

export default CreateBrand;
