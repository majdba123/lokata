import {
  forgetPasswordApi,
  verifyOtpApi,
} from "@/api/services/auth/auth-service";
import { Button } from "@/components/ui/button";
import { Mail, KeyRound } from "lucide-react"; // Import KeyRound for OTP icon
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Inputs = {
  email: string;
  otp: string;
};

function VerifyOtp() {
  const navigate = useNavigate();
  // Use isSubmitting from formState for the main submit button
  // Use a separate state for the resend action
  const [isResending, setIsResending] = useState(false);
  const {
    register,
    handleSubmit,
    getValues, // To get email for resend
    watch, // To watch email field for disabling resend button
    formState: { errors, isSubmitting }, // Use isSubmitting for form submission state
  } = useForm<Inputs>();

  const emailValue = watch("email"); // Watch the email field

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      // No need for setIsLoading(true) here, isSubmitting handles it
      await verifyOtpApi(data);
      toast.success(
        "تم التحقق بنجاح، تم إرسال كلمة المرور الجديدة إلى بريدك الإلكتروني."
      );
      navigate("/login");
      // No need for setIsLoading(false) here
    } catch (error: any) {
      toast.error(error.message || "حدث خطأ ما");
      // No need for setIsLoading(false) here
    }
  };

  const handleResendOtp = async () => {
    const email = getValues("email");
    if (!email) {
      toast.error("الرجاء إدخال البريد الإلكتروني أولاً.");
      return;
    }
    // Basic email format check (optional, as RHF validation should handle it)
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("صيغة البريد الإلكتروني غير صحيحة.");
      return;
    }

    setIsResending(true);
    try {
      await forgetPasswordApi({ email }); // Use the forgetPassword API to resend
      toast.success("تم إعادة إرسال رمز التحقق بنجاح.");
    } catch (error: any) {
      toast.error(error.message || "فشل إرسال الرمز، حاول مرة أخرى.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen bg-white rounded-[10px]">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"></div>

      {/* Right side with form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white ">
        <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 rounded-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              التحقق من الرمز
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              أدخل عنوان بريدك الإلكتروني ورمز التحقق المرسل إليه.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="flex flex-col space-y-4">
              {/* Email Input */}
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  البريد الإلكتروني
                </label>
                <Mail
                  className="absolute top-3 right-3 text-gray-400"
                  size={20}
                />
                <input
                  {...register("email", {
                    required: "البريد الإلكتروني مطلوب",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "صيغة البريد الإلكتروني غير صحيحة",
                    },
                  })}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none rounded relative block w-full px-3 py-2 pr-10 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="البريد الإلكتروني"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* OTP Input */}
              <div className="relative">
                <label htmlFor="otp" className="sr-only">
                  رمز التحقق
                </label>
                <KeyRound // OTP Icon
                  className="absolute top-3 right-3 text-gray-400"
                  size={20}
                />
                <input
                  {...register("otp", { required: "رمز التحقق مطلوب" })}
                  id="otp"
                  type="text" // Keep as text to allow leading zeros if any
                  inputMode="numeric" // Hint for numeric keyboard on mobile
                  autoComplete="one-time-code"
                  className={`appearance-none rounded relative block w-full px-3 py-2 pr-10 border ${
                    errors.otp ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="رمز التحقق"
                />
                {errors.otp && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.otp.message}
                  </p>
                )}
              </div>
            </div>

            {/* Resend OTP Button */}
            <div className="text-sm text-right">
              {" "}
              {/* Align to left for visual separation */}
              <Button
                type="button" // Important: type="button" to prevent form submission
                variant="link" // Use link variant for less emphasis
                onClick={handleResendOtp}
                disabled={isResending || !emailValue || !!errors.email} // Disable if resending, email empty, or email has errors
                className="p-0 h-auto font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline"
              >
                {isResending ? "جاري الإرسال..." : "إعادة إرسال الرمز"}
              </Button>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <Button
                type="submit"
                disabled={isSubmitting} // Use isSubmitting from RHF
                className="w-full bg-[#194EB4] text-white hover:bg-[#153e8a]"
              >
                {isSubmitting ? "جاري التأكيد..." : "تأكيد"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
