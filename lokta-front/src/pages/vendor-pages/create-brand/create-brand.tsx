import { SubmitHandler, useForm } from "react-hook-form";

type BrandData = {
  brandName: string;
};

function CreateBrand() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandData>();

  const onSubmit: SubmitHandler<BrandData> = (data) => {
    console.log(data);
  };

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
        >
          Create Brand
        </button>
      </form>
    </div>
  );
}

export default CreateBrand;
