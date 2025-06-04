import { getBrandsBySubcategoryApi } from "@/api/services/brand/brand-service";
import { Brand } from "@/api/services/brand/types";
import { Category } from "@/api/services/category/types"; // Added Category
import React, { useEffect, useState, useMemo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import ChoosePlan from "./choose-plan";
import useCategoriesQuery from "@/pages/all-category-page/useCategoriesQuery";

export type ProductData = {
  productTitle: string;
  productPrice: string;
  productDescription: string;
  productImage: string;
  brand_id: number;
  category_id: number; // Added category_id
  sub__category_id: number;
  currency: "sy" | "us";
  city: string;
};

export const SY_CITIES = [
  "دمشق",
  "حلب",
  "حمص",
  "حماة",
  "اللاذقية",
  "طرطوس",
  "إدلب",
  "دير الزور",
  "الرقة",
  "الحسكة",
  "درعا",
  "السويداء",
  "القنيطرة",
  "ريف دمشق",
];

type Step = "form" | "plan";

function CreateProduct() {
  const allCategoriesQuery = useCategoriesQuery();
  const [previewImages, setPreviewImages] = React.useState<string[] | null>(
    null
  );
  const [newImages, setNewImages] = useState<File[] | null>(null); // Changed from string[] to File[]
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentStep, setCurrentStep] = useState<Step>("form");
  const [submittedProductData, setSubmittedProductData] =
    useState<ProductData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue, // Added setValue
  } = useForm<ProductData>({
    defaultValues: {
      city: "",
      category_id: "" as any, // Initialized for RHF
      sub__category_id: "" as any,
      brand_id: "" as any,
      currency: "sy",
      productTitle: "",
      productPrice: "",
      productDescription: "",
    },
  });

  const watchedCategoryId = watch("category_id");
  const watchedSubcategoryId = watch("sub__category_id");

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
      setNewImages(files); // Store File objects directly
    } else {
      setPreviewImages(null);
      setNewImages(null);
    }
  };

  useEffect(() => {
    // Effect to reset subcategory and brand when category changes
    if (watchedCategoryId !== undefined) {
      // Check to ensure it's not the initial undefined state before RHF sets default
      setValue("sub__category_id", "" as any);
      setValue("brand_id", "" as any);
      setBrands([]);
    }
  }, [watchedCategoryId, setValue]);

  useEffect(() => {
    const fetchBrandsForSubcategory = async (subId: any) => {
      if (!subId || subId === "") {
        setBrands([]);
        return;
      }
      try {
        const data = await getBrandsBySubcategoryApi(Number(subId));
        setBrands(data);
      } catch (error: any) {
        toast.error(error.message);
        setBrands([]);
      }
    };
    if (watchedSubcategoryId) {
      fetchBrandsForSubcategory(watchedSubcategoryId);
    }
  }, [watchedSubcategoryId]);

  const onFormSubmit: SubmitHandler<ProductData> = async (
    data: ProductData
  ) => {
    if (!newImages || newImages.length === 0) {
      toast.error("الرجاء اختيار صور المنتج.");
      return;
    }
    const processedData = {
      ...data,
      category_id: Number(data.category_id),
      sub__category_id: Number(data.sub__category_id),
      brand_id: Number(data.brand_id),
    };
    setSubmittedProductData(processedData);
    setCurrentStep("plan");
    toast.info("بيانات المنتج جاهزة, اختر الخطة الآن.");
  };

  const handleGoBackToForm = () => {
    setCurrentStep("form");
  };

  const filteredSubcategories = useMemo(() => {
    if (!watchedCategoryId) {
      return [];
    }

    const curCategory = allCategoriesQuery.data?.filter(
      (category: Category) => category.id === Number(watchedCategoryId)
    );

    if (!curCategory || curCategory.length === 0) {
      return [];
    }

    return curCategory[0].sub_category;
  }, [watchedCategoryId, allCategoriesQuery.data]);

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
            <div>
              <label htmlFor="city"> المدينة</label>
              <select
                {...register("city", {
                  required: " المدينة مطلوبة",
                })}
                className="border border-gray-300 rounded-md p-2 w-full"
                defaultValue=""
              >
                <option value="" disabled>
                  اختر المدينة
                </option>{" "}
                {SY_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <span className="text-red-500 text-sm">
                  {errors.city.message}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="category_id">الفئة الرئيسية</label>
              <select
                {...register("category_id", {
                  required: "الفئة الرئيسية مطلوبة",
                })}
                className="border border-gray-300 rounded-md p-2 w-full"
                defaultValue=""
                disabled={allCategoriesQuery.isLoading}
              >
                <option value="" disabled>
                  {allCategoriesQuery.isLoading
                    ? "جاري التحميل..."
                    : "اختر الفئة الرئيسية"}
                </option>
                {allCategoriesQuery.data?.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}{" "}
                    {/* Assuming category has a 'title' field */}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <span className="text-red-500 text-sm">
                  {errors.category_id.message}
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
                defaultValue=""
                disabled={
                  !watchedCategoryId || filteredSubcategories.length === 0
                }
              >
                <option value="" disabled>
                  {watchedCategoryId
                    ? "اختر الفئة الفرعية"
                    : "اختر فئة رئيسية أولاً"}
                </option>{" "}
                {filteredSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.title}
                  </option>
                ))}
              </select>
              {watchedCategoryId && filteredSubcategories.length === 0 && !allCategoriesQuery.isLoading && (
                <p className="text-sm text-orange-500 mt-1">
                  لا توجد فئات فرعية لهذه الفئة الرئيسية.
                </p>
              )}
              {errors.sub__category_id && (
                <span className="text-red-500 text-sm">
                  {errors.sub__category_id.message}
                </span>
              )}
            </div>

            <div className={`${!watchedSubcategoryId && "opacity-[0.4]"}`}>
              <label htmlFor="brand_id">العلامة التجارية</label>
              <select
                {...register("brand_id", {
                  required: "العلامة التجارية مطلوبة",
                })} // Brand is required
                className="border border-gray-300 rounded-md p-2 w-full"
                defaultValue=""
                disabled={!watchedSubcategoryId || brands.length === 0}
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
              {watchedSubcategoryId && brands.length === 0 && (
                <p className="text-sm text-orange-500 mt-1">
                  لا توجد علامات تجارية لهذه الفئة الفرعية.
                </p>
              )}
              {errors.brand_id && (
                <span className="text-red-500 text-sm">
                  {errors.brand_id.message}
                </span>
              )}
            </div>

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
                  step="any"
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
                صور المنتج
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
              />
              {errors.productImage && !newImages && (
                <span className="text-red-500 text-sm">
                  الرجاء اختيار صورة واحدة على الأقل.
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

            <button
              type="submit"
              className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 disabled:opacity-50"
            >
              التالي (اختيار الخطة)
            </button>
          </form>
        </>
      )}

      {currentStep === "plan" && submittedProductData && (
        <ChoosePlan
          productData={submittedProductData}
          imageFiles={newImages}
          onBack={handleGoBackToForm}
        />
      )}
    </div>
  );
}

export default CreateProduct;
