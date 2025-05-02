import { getBrandsApi } from "@/api/services/brand/brand-service";
import { Brand } from "@/api/services/brand/types";
import { allSubCategoriesApi } from "@/api/services/category/category-service";
import { Subcategory } from "@/api/services/category/types";
import { uploadFileApi } from "@/api/services/file-upload/file-upload-service";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import ChoosePlan from "./choose-plan";

export type ProductData = {
  productTitle: string;
  productPrice: string;
  productDescription: string;
  productImage: string;
  brand_id: number;
  sub__category_id: number;
  currency: "sy" | "us";
};

type Step = "form" | "plan";

function CreateProduct() {
  const [previewImages, setPreviewImages] = React.useState<string[] | null>(
    null
  );
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [newImages, setNewImages] = useState<string[] | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subCategories, setSubCategories] = useState<Subcategory[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>("form");
  const [submittedProductData, setSubmittedProductData] =
    useState<ProductData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductData>();

  const handleChooseFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length === 0) {
        setPreviewImages(null);
        setNewImages(null); // Clear uploaded images if user deselects files
        return;
      }
      const images = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(images);
      await handleUploadWithFiles(files);
    } else {
      setPreviewImages(null);
      setNewImages(null);
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
      setNewImages(null);
      const res = await uploadFileApi(formData);
      setNewImages(res.urls);
      setLoadingUpload(false);
      toast.success("تم رفع الملف بنجاح"); // File uploaded successfully
    } catch (error: any) {
      setPreviewImages(null); // Clear preview if upload fails
      setNewImages(null);
      toast.error("برجاء تغيير نوع الصورة" + error.message);
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

  const onFormSubmit: SubmitHandler<ProductData> = async (
    data: ProductData
  ) => {
    if (!newImages || newImages.length === 0) {
      toast.error("الرجاء الانتظار حتى يتم رفع الصور بنجاح أو قم باختيار صور.");
      return;
    }
    setSubmittedProductData(data);
    setCurrentStep("plan");
    toast.info("بيانات المنتج جاهزة, اختر الخطة الآن.");
  };

  const handleGoBackToForm = () => {
    setCurrentStep("form");
  };

  return (
    <div dir="rtl" className="mx-auto p-8 w-[100%]">
      {currentStep === "form" && (
        <>
          <h1 className="text-2xl font-semibold mb-6 text-center">
            إنشاء منتج جديد
          </h1>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="w-full">
                <label htmlFor="productTitle">عنوان المنتج</label>
                <input
                  {...register("productTitle", {
                    required: "عنوان المنتج مطلوب", // Product title is required
                  })}
                  step="any"
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
              <div className="w-full">
                <label htmlFor="currency">العملة</label>
                <select
                  {...register("currency", {
                    required: "العملة مطلوبة", // Currency is required
                  })}
                  className="border border-gray-300 rounded-md p-2 w-full" // Adjusted padding
                  defaultValue="sy"
                >
                  <option value="sy">ليرة سورية</option>
                  <option value="us">دولار أمريكي</option>
                </select>
                {errors.currency && (
                  <span className="text-red-500 text-sm">
                    {errors.currency.message}
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
              <label htmlFor="productImageInput">
                {" "}
                {/* Changed id to avoid conflict with register name */}
                صور المنتج {loadingUpload && "(جاري رفع الصور...)"}
                {!newImages && (
                  <span className="text-red-500 text-xs ml-2">(مطلوب)</span>
                )}{" "}
                {/* Indicate requirement */}
              </label>
              <input
                type="file"
                id="productImageInput"
                className="border border-gray-300 rounded-md p-2 w-full"
                onChange={handleChooseFile}
                accept="image/*"
                multiple={true}
                disabled={loadingUpload}
              />
              {!newImages &&
                errors.productImage &&
                errors.productImage && ( // Show error only on submit attempt if no images are uploaded
                  <span className="text-red-500 text-sm">
                    الرجاء اختيار ورفع صورة واحدة على الأقل.
                  </span>
                )}
              {previewImages && (
                <div className="flex gap-4 mt-2 flex-wrap">
                  {previewImages.map((previewImage, index) => (
                    <img
                      key={index}
                      src={previewImage}
                      alt="Preview"
                      className="max-h-[190px] max-w-[200px] rounded-md object-cover" // Added object-cover
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="brand_id">العلامة التجارية</label>
              <select
                {...register("brand_id", {
                  required: "العلامة التجارية مطلوبة",
                })} // Brand is required
                className="border border-gray-300 rounded-md p-2 w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  اختر العلامة التجارية
                </option>{" "}
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
                <option value="" disabled>
                  اختر الفئة الفرعية
                </option>{" "}
                {/* Select Subcategory */}
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
              className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 disabled:opacity-50"
              disabled={loadingUpload}
            >
              {loadingUpload ? "جاري رفع الصور..." : "التالي (اختيار الخطة)"}
            </button>
          </form>
        </>
      )}

      {currentStep === "plan" && submittedProductData && (
        <ChoosePlan
          productData={submittedProductData}
          imageUrls={newImages}
          onBack={handleGoBackToForm}
        />
      )}
    </div>
  );
}

export default CreateProduct;
