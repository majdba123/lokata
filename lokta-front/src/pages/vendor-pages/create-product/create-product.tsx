import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type ProductData = {
  productTitle: string;
  productPrice: string;
  productDescription: string;
  productImage: string;
};

function CreateProduct() {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductData>();
  const onSubmit: SubmitHandler<ProductData> = (data: ProductData) => {
    console.log(data);
  };

  const handleChooseFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setPreviewImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <div className="mx-auto p-8 w-[100%]">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4">
          <div className="w-[100%]">
            <label htmlFor="productTitle">Product Title</label>
            <input
              {...register("productTitle", {
                required: "Product title is required",
              })}
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Enter Product Title"
            />
            {errors.productTitle && (
              <span className="text-red-500 text-sm">
                {errors.productTitle.message}
              </span>
            )}
          </div>

          <div className="w-[100%]">
            <label htmlFor="productPrice">Product Price</label>
            <input
              {...register("productPrice", {
                required: "Price is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Invalid price format",
                },
              })}
              type="number"
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Enter Product Price"
            />
            {errors.productPrice && (
              <span className="text-red-500 text-sm">
                {errors.productPrice.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="productDescription">Product Description</label>
          <textarea
            {...register("productDescription", {
              required: "Description is required",
            })}
            className="border border-gray-300 rounded-md p-2 min-h-[100px] w-full"
            placeholder="Enter Product Description"
          />
          {errors.productDescription && (
            <span className="text-red-500 text-sm">
              {errors.productDescription.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="productImage">Product Image</label>
          <input
            {...register("productImage", { required: "Image is required" })}
            type="file"
            className="border border-gray-300 rounded-md p-2 w-full"
            onChange={handleChooseFile}
            accept="image/*"
            multiple={true}
          />
          {errors.productImage && (
            <span className="text-red-500 text-sm">
              {errors.productImage.message}
            </span>
          )}
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="mt-2 max-h[190px] max-w-[200px] rounded-md"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
