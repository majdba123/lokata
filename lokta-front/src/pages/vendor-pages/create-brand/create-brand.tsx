import { createBrandApi } from "@/api/services/brand/brand-service";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type BrandData = {
  brandName: string;
};

function CreateBrand() {
  const isVendor = useAuthStore((state) => state.user?.is_vendor);
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
      toast.success("Brand created successfully");
      setLoadingCreateBrand(false);
      reset();
    } catch (error: any) {
      toast.error(error?.message);
    }
  };

  if (!isVendor) {
    return (
      <div className="text-center text-red-500 text-2xl font-bold mt-4 w-full">
        {" "}
        You are not a Seller{" "}
      </div>
    );
  }
  return (
    <div className="mx-auto p-8 w-[100%]">
      {/* code for create new brand (name) , using tailwind and react hook form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="brand-name">Brand Name</label>
        <input
          type="text"
          id="brand-name"
          {...register("brandName", { required: "Brand name is required" })}
          className="border border-gray-300 rounded-md p-2"
          placeholder="Enter Brand Name"
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
          Create Brand
        </button>
      </form>
    </div>
  );
}

export default CreateBrand;
