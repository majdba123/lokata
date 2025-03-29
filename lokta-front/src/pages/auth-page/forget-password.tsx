import { forgetPasswordApi } from "@/api/services/auth/auth-service";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type Inputs = {
  email: string;
};

function ForgetPassword() {
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await forgetPasswordApi(data);
      toast.success("تم إرسال البريد الإلكتروني بنجاح");
      navigation("/verify-otp");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div dir="rtl" className="flex min-h-screen bg-white rounded-[10px]">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"></div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white ">
        <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 rounded-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              نسيت كلمة المرور
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className=" flex flex-col space-y-4">
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  البريد الإلكتروني
                </label>
                <Mail
                  className="absolute top-3 right-3 text-gray-400"
                  size={20}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none rounded relative block w-full px-3 py-2 pr-10 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="البريد الإلكتروني"
                  {...register("email", {
                    required: "البريد الإلكتروني مطلوب",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "صيغة البريد الإلكتروني غير صحيحة",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Button
                disabled={isLoading}
                type="submit"
                className="w-full bg-[#194EB4] text-white hover:bg-[#153e8a]"
              >
                {isLoading ? (
                  <p className="flex items-center justify-center">
                    جاري التحميل ...
                  </p>
                ) : (
                  "إرسال رمز التحقق"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
