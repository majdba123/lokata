import { allSubCategoriesApi } from "@/api/services/category/category-service";
import { Subcategory } from "@/api/services/category/types";
import { updateProductApi } from "@/api/services/products/product-service";
import { Product } from "@/api/services/products/types";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { SY_CITIES } from "../vendor-pages/create-product/create-product";
import useBrandsQuery from "../category-page/useBrandsQuery";

type Props = Product & {
  onCancel: () => void;
  onUpdate: (newProduct: Product) => void;
};
type ProductData = {
  productTitle: string;
  productPrice: string;
  productDescription: string;
  productImage: string;
  brand_id: number;
  sub__category_id: number;
  currency: "sy" | "us";
  city: string;
};

function UpdateProduct(props: Props) {
  const [previewImages, setPreviewImages] = React.useState<string[] | null>(
    null
  );
  const [newImages, setNewImages] = useState<File[] | null>(null); // Changed to File[]
  const [loadingCreateProduct, setLoadingCreateProduct] = useState(false);
  const [subCategories, setSubCategories] = useState<Subcategory[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<ProductData>({
    defaultValues: {
      brand_id: props.brand_id,
      productDescription: props.description ?? "",
      productPrice: props.price.toString(),
      productTitle: props.title,
      sub__category_id: props.sub__category_id,
      currency: props.currency,
      city: props.city ?? "",
    },
  });

  const watchedSubCategoryId = watch("sub__category_id");
  const brandsQuery = useBrandsQuery({
    id: watchedSubCategoryId,
  });

  const handleChooseFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const images = files.map((file) => URL.createObjectURL(file));
      setNewImages(files); // Store File objects
      setPreviewImages(images);
    } else {
      setNewImages(null);
      setPreviewImages(null);
    }
  };
  useEffect(() => {
    fetchSubCategories();
  }, []);

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

      const formData = new FormData();
      formData.append("title", data.productTitle);
      formData.append("price", String(data.productPrice));
      formData.append("description", data.productDescription);
      formData.append("brand_id", String(data.brand_id));
      formData.append("sub__category_id", String(data.sub__category_id));
      formData.append("currency", data.currency);
      formData.append("city", data.city);
    
      if (newImages && newImages.length > 0) {
        newImages.forEach((file, idx) => {
          formData.append(`images[${idx}]`, file);
        });
      }
  
      const res = await updateProductApi(props.id, formData);
      setLoadingCreateProduct(false);
      reset();
      props.onUpdate(res);
      toast.success("تم تحديث المنتج بنجاح"); // Product Updated successfully
      setPreviewImages(null);
      setNewImages(null);
    } catch (error: any) {
      toast.error(error.message);
      setLoadingCreateProduct(false);
    }
  };

  return (
    <div dir="rtl" className="max-h-[90vh] overflow-y-auto px-5">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
            <span className="text-red-500 text-sm">{errors.city.message}</span>
          )}
        </div>
        <div>
          <label htmlFor="sub__category_id">الفئة الفرعية</label>
          <select
            {...register("sub__category_id", {})}
            className="border border-gray-300 rounded-md p-2 w-full"
          >
            <option value="">اختر الفئة الفرعية</option>
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
        <div className={`${!watch("sub__category_id") && "opacity-[0.4]"}`}>
          <label htmlFor="brand_id">
            العلامة التجارية{" "}
            {brandsQuery.isLoading && "(جاري تحميل الماركات...)"}
          </label>{" "}
          <select
            {...register("brand_id")}
            className="border border-gray-300 rounded-md p-2 w-full"
            disabled={!watchedSubCategoryId || brandsQuery.isLoading}
          >
            <option value="">اختر العلامة التجارية</option>
            {brandsQuery.status == "success" &&
              brandsQuery.data.map((brand) => (
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

        <div className="flex gap-4 flex-col md:flex-row">
          <div className="w-full">
            <label htmlFor="productTitle">عنوان المنتج</label>
            <input
              {...register("productTitle", {})}
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="أدخل عنوان المنتج"
            />
            {errors.productTitle && (
              <span className="text-red-500 text-sm">
                {errors.productTitle.message}
              </span>
            )}
          </div>

          <div className="w-full flex gap-2">
            <div>
              <label htmlFor="productPrice">سعر المنتج</label>
              <input
                {...register("productPrice", {
                  pattern: {
                    value: /^\d+(\.\d{1,2})?$/,
                    message: "صيغة السعر غير صحيحة", // Invalid price format
                  },
                })}
                type="number"
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder="أدخل سعر المنتج"
              />
              {errors.productPrice && (
                <span className="text-red-500 text-sm">
                  {errors.productPrice.message}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="currency">العملة</label>
              <select
                {...register("currency")}
                className="border border-gray-300 rounded-md p-1 w-full"
                defaultValue={props.currency}
              >
                <option value="sy"> ليرة</option>
                <option value="us">دولار</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="productDescription">وصف المنتج</label>
          <textarea
            {...register("productDescription", {})}
            className="border border-gray-300 rounded-md p-2 min-h-[100px] w-full"
            placeholder="أدخل وصف المنتج"
          />
          {errors.productDescription && (
            <span className="text-red-500 text-sm">
              {errors.productDescription.message}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="productImage">
            صورة المنتج (ستحل الصور الجديدة محل القديمة)
          </label>
          <input
            {...register("productImage")}
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

        <div className="flex justify-end gap-7">
          <button
            type="button"
            onClick={props.onCancel}
            className=" rounded-md cursor-pointer p-2 hover:bg-blue-500 hover:text-white"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
            disabled={loadingCreateProduct}
          >
            {loadingCreateProduct ? "جاري التحميل..." : "تحديث المنتج"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateProduct;
