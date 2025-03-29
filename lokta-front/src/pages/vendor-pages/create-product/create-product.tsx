import { getBrandsApi } from "@/api/services/brand/brand-service";
import { Brand } from "@/api/services/brand/types";
import { allSubCategoriesApi } from "@/api/services/category/category-service";
import { Subcategory } from "@/api/services/category/types";
import { uploadFileApi } from "@/api/services/file-upload/file-upload-service";
import { createProductApi } from "@/api/services/products/product-service";
import { CreateProductRequest } from "@/api/services/products/types";
import { useAuthStore } from "@/zustand-stores/auth.store";
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

  const isVendor = useAuthStore((state) => state.user?.is_vendor);

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
      toast.success("تم رفع الملف بنجاح"); // File uploaded successfully
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
      toast.success("تم إنشاء المنتج بنجاح"); // Product created successfully
      reset();
      setPreviewImages(null);
      setNewImages(null);
    } catch (error: any) {
      toast.error(error.message);
      setLoadingCreateProduct(false);
    }
  };

  if (!isVendor) {
    return (
      <div className="text-center text-red-500 text-2xl font-bold mt-4 w-full">
        أنت لست بائعًا
      </div>
    );
  }

  return (
    <div dir="rtl" className="mx-auto p-8 w-[100%]">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="w-full">
            <label htmlFor="productTitle">عنوان المنتج</label>
            <input
              {...register("productTitle", {
                required: "عنوان المنتج مطلوب", // Product title is required
              })}
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="أدخل عنوان المنتج" // Enter Product Title
            />
            {errors.productTitle && (
              <span className="text-red-500 text-sm">
                {errors.productTitle.message}
              </span>
            )}
          </div>

          <div className="w-full">
            <label htmlFor="productPrice">سعر المنتج</label>
            <input
              {...register("productPrice", {
                required: "السعر مطلوب", // Price is required
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "صيغة السعر غير صحيحة", // Invalid price format
                },
              })}
              type="number"
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="أدخل سعر المنتج" // Enter Product Price
            />
            {errors.productPrice && (
              <span className="text-red-500 text-sm">
                {errors.productPrice.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="productDescription">وصف المنتج</label>
          <textarea
            {...register("productDescription", {
              required: "الوصف مطلوب", // Description is required
            })}
            className="border border-gray-300 rounded-md p-2 min-h-[100px] w-full"
            placeholder="أدخل وصف المنتج" // Enter Product Description
          />
          {errors.productDescription && (
            <span className="text-red-500 text-sm">
              {errors.productDescription.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="productImage">
            صورة المنتج {loadingUpload && "جاري التحميل..."}
          </label>
          <input
            {...register("productImage", { required: "الصورة مطلوبة" })} // Image is required
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
            <div className="flex gap-4 mt-2 flex-wrap">
              {previewImages.map((previewImage, index) => (
                <img
                  key={index}
                  src={previewImage}
                  alt="Preview"
                  className="max-h-[190px] max-w-[200px] rounded-md"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="brand_id">العلامة التجارية</label>
          <select
            {...register("brand_id", { required: "العلامة التجارية مطلوبة" })} // Brand is required
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="">اختر العلامة التجارية</option> {/* Select Brand */}
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
          <label htmlFor="sub__category_id">الفئة الفرعية</label>
          <select
            {...register("sub__category_id", {
              required: "الفئة الفرعية مطلوبة", // Subcategory is required
            })}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="">اختر الفئة الفرعية</option> {/* Select Subcategory */}
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
          {loadingCreateProduct ? "جاري التحميل..." : "إنشاء المنتج"}
        </button>
      </form>
    </div>
  );
}

export default CreateProduct;
