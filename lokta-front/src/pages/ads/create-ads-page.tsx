"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AdsChoosePlan from "./ads-choose-plan";

// Custom file validation function
const validateImageFile = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      resolve("حجم الصورة يجب أن لا يتجاوز 5MB");
      return;
    }

    // Check file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      resolve("صيغة الصورة غير مدعومة (فقط JPG, PNG, WEBP)");
      return;
    }

    // Check image dimensions
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const { width, height } = img;
      const minWidth = 600;
      const minHeight = 300;
      const aspectRatio = width / height;
      const minAspectRatio = 1.5;
      const maxAspectRatio = 3.0;

      if (width < minWidth || height < minHeight) {
        resolve(
          `أبعاد الصورة يجب أن تكون على الأقل ${minWidth}x${minHeight} بكسل`
        );
      } else if (aspectRatio < minAspectRatio || aspectRatio > maxAspectRatio) {
        resolve(
          `نسبة أبعاد الصورة غير مناسبة. يجب أن تكون أفقية (العرض/الارتفاع بين ${minAspectRatio} و ${maxAspectRatio})`
        );
      } else {
        resolve(null); // No error
      }

      URL.revokeObjectURL(img.src);
    };

    img.onerror = () => {
      resolve("تعذر تحميل الصورة للتحقق من الأبعاد");
    };

    img.src = URL.createObjectURL(file);
  });
};

// Improved Zod schema
const adSchema = z.object({
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "صورة الاعلان مطلوبة")
    .refine((files) => files instanceof FileList, "يجب اختيار ملف صالح")
    .refine(
      (files) => files[0].size <= 5 * 1024 * 1024,
      "حجم الصورة يجب أن لا يتجاوز 5MB"
    )
    .refine(
      (files) => ["image/jpeg", "image/png", "image/webp"].includes(files[0].type),
      "صيغة الصورة غير مدعومة (فقط JPG, PNG, WEBP)"
    ),
  adLink: z.string().min(1, "لينك الاعلان مطلوب").url("الرابط غير صالح"),
});

type AdFormData = z.infer<typeof adSchema>;

type Step = "form" | "plan";

export default function CreateAdsPage() {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isValidatingImage, setIsValidatingImage] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("form");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setError,
    clearErrors,
    getValues,
  } = useForm<AdFormData>({
    resolver: zodResolver(adSchema),
  });

  const watchedImage = watch("image");

  useEffect(() => {
    const validateAndPreview = async () => {
      let file: File | null = null;
      if (watchedImage) {
        if (watchedImage instanceof FileList && watchedImage.length > 0) {
          file = watchedImage[0];
        } else if (watchedImage instanceof File) {
          file = watchedImage;
        }
      }
      if (file) {
        setIsValidatingImage(true);
        clearErrors("image");

        const url = URL.createObjectURL(file);
        setImagePreviewUrl(url);

        const validationError = await validateImageFile(file);

        if (validationError) {
          setError("image", {
            type: "manual",
            message: validationError,
          });
        }

        setIsValidatingImage(false);

        return () => URL.revokeObjectURL(url);
      } else {
        setImagePreviewUrl(null);
        setIsValidatingImage(false);
      }
    };

    validateAndPreview();
  }, [watchedImage, clearErrors, setError]);

  const onSubmit = async (data: AdFormData) => {
    try {
      if (data.image) {
        const validationError = await validateImageFile(data.image[0]);
        if (validationError) {
          setError("image", {
            type: "manual",
            message: validationError,
          });
          return;
        }
      }
      toast.success(
        "بيانات الاعلان جاهزة، سيتم نقلك الى اختيار خطط الاعلان وطرق الدفع"
      );
      setImagePreviewUrl(null);
      setCurrentStep("plan");
    } catch (error) {
      toast.error("حدث خطأ أثناء معالجة البيانات");
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center" dir="rtl">
      {currentStep === "form" && (
        <div className="flex flex-col items-center justify-center gap-4 p-6 border border-gray-300 rounded-lg shadow-md w-full max-w-2xl text-right">
          <h1 className="text-2xl font-semibold text-center mb-4">
            انشئ اعلان جديد خاص بك هنا
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-6"
          >
            {/* Image Upload Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="image" className="font-medium">
                صورة الاعلان *
              </Label>
              <Input
                type="file"
                id="image"
                accept="image/jpeg,image/png,image/webp"
                {...register("image")}
                className="file:ml-2 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />

              {isValidatingImage && (
                <p className="text-blue-600 text-sm">
                  جاري التحقق من الصورة...
                </p>
              )}

              {imagePreviewUrl && (
                <div className="mt-4 w-full flex flex-col items-center justify-center">
                  <p className="mb-2 text-sm font-medium">معاينة الصورة:</p>
                  <div className="relative max-w-md">
                    <img
                      src={imagePreviewUrl || "/placeholder.svg"}
                      alt="معاينة الصورة"
                      className="w-full h-auto rounded-md border border-gray-200 shadow-sm"
                    />
                    {errors.image && (
                      <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-md flex items-center justify-center">
                        <span className="text-red-700 text-sm font-medium bg-white px-2 py-1 rounded">
                          خطأ في الصورة
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {errors.image && (
                <p className="text-red-500 text-sm">{errors.image.message}</p>
              )}
            </div>

            {/* Ad Link Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="adLink" className="font-medium">
                لينك الاعلان *
              </Label>
              <Input
                type="url"
                id="adLink"
                {...register("adLink")}
                placeholder="https://example.com"
                className="text-right"
                dir="ltr"
              />
              {errors.adLink && (
                <p className="text-red-500 text-sm">{errors.adLink.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isValid}
              className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              التالي
            </Button>
          </form>

          {/* Requirements Info */}
          <div className="w-full mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <h3 className="font-medium mb-2">متطلبات الصورة:</h3>
            <ul className="space-y-1 text-right">
              <li>• الحد الأقصى للحجم: 5 ميجابايت</li>
              <li>• الصيغ المدعومة: JPG, PNG, WEBP</li>
              <li>• الحد الأدنى للأبعاد: 600×300 بكسل</li>
              <li>• نسبة العرض إلى الارتفاع: بين 1.5 و 3.0</li>
            </ul>
          </div>
        </div>
      )}
      {currentStep === "plan" && (
        <AdsChoosePlan
          backToForm={() => {
            setCurrentStep("form");
          }}
          adsData={getValues()}
        />
      )}
    </div>
  );
}
