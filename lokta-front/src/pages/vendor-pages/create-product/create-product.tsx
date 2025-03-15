import { getBrandsApi } from "@/api/services/brand/brand-service";
import { Brand } from "@/api/services/brand/types";
import { allSubCategoriesApi } from "@/api/services/category/category-service";
import { Subcategory } from "@/api/services/category/types";
import { uploadFileApi } from "@/api/services/file-upload/file-upload-service";
import { createProductApi } from "@/api/services/products/product-service";
import { CreateProductRequest } from "@/api/services/products/types";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type ProductData = {
  productTitle: string;
  productPrice: string;
  productDescription: string;
  productImage: string;
  brand_id: number;
  sub__category_id: number;
};

function CreateProduct() {
  const [previewImages, setPreviewImages] = React.useState<string[] | null>(
    null
  );
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [newImages, setNewImages] = useState<string[] | null>(null);
  const [loadingCreateProduct, setLoadingCreateProduct] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subCategories, setSubCategories] = useState<Subcategory[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductData>();

  const handleChooseFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const images = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(images);
      await handleUploadWithFiles(files);
    }
  };
  const handleUploadWithFiles = async (files: File[]) => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    try {
      setLoadingUpload(true);
      const res = await uploadFileApi(formData);
      setNewImages(res.urls);
      setLoadingUpload(false);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      toast.error(error.message);
      setLoadingUpload(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await getBrandsApi();
      setBrands(data.brands);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  const fetchSubCategories = async () => {
    try {
      const data = await allSubCategoriesApi();
      setSubCategories(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const onSubmit: SubmitHandler<ProductData> = async (data: ProductData) => {
    try {
      setLoadingCreateProduct(true);
      const req: CreateProductRequest = {
        title: data.productTitle,
        price: +data.productPrice,
        description: data.productDescription,
        images: newImages ?? [],
        brand_id: +data.brand_id,
        sub__category_id: +data.sub__category_id,
      };

      await createProductApi(req);
      setLoadingCreateProduct(false);
      toast.success("Product created successfully");
      reset();
      setPreviewImages(null);
      setNewImages(null);
    } catch (error: any) {
      toast.error(error.message);
      setLoadingCreateProduct(false);
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
          <label htmlFor="productImage">
            Product Image {loadingUpload && "Loading..."}
          </label>
          <input
            {...register("productImage", { required: "Image is required" })}
            type="file"
            className="border border-gray-300 rounded-md p-2 w-full"
            onChange={handleChooseFile}
            accept="image/*"
            multiple={true}
            disabled={loadingUpload}
          />
          {errors.productImage && (
            <span className="text-red-500 text-sm">
              {errors.productImage.message}
            </span>
          )}
          {previewImages && (
            <div className="flex gap-4 mt-2">
              {previewImages.map((previewImage, index) => (
                <img
                  key={index}
                  src={previewImage}
                  alt="Preview"
                  className="max-h[190px] max-w-[200px] rounded-md"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="brand_id">Brand</label>
          <select
            {...register("brand_id", { required: "Brand is required" })}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {errors.brand_id && (
            <span className="text-red-500 text-sm">
              {errors.brand_id.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="sub__category_id">Subcategory</label>
          <select
            {...register("sub__category_id", {
              required: "Subcategory is required",
            })}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="">Select Subcategory</option>
            {subCategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.title}
              </option>
            ))}
          </select>
          {errors.sub__category_id && (
            <span className="text-red-500 text-sm">
              {errors.sub__category_id.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
          disabled={loadingCreateProduct}
        >
          Create Product
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
