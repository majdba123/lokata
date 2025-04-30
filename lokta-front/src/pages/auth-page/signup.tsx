import { signupApi } from "@/api/services/auth/auth-service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Inputs = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

function Signup() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      await signupApi({
        email: data.email,
        password: data.password,
        name: data.fullName,
      });
      toast.success(
        "تم إنشاء الحساب بنجاح , برجاء التحقق من الايميل وتفعيل الحساب "
      );
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      toast.error("خطأ في إنشاء الحساب");
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen ">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2  items-center justify-center p-12"></div>

      {/* Right side with sign up form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              مرحبا بك في lokta
            </h2>
            <p className="mt-2 text-sm text-gray-600">إنشاء حساب جديد</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`appearance-none rounded relative block w-full py-2 pr-2 pl-10 border ${
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

            <div className="relative">
              <label htmlFor="fullName" className="sr-only">
                الاسم الكامل
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="fullName"
                className={`appearance-none rounded relative block w-full py-2 pr-2 pl-10 border ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="الاسم الكامل"
                {...register("fullName", {
                  required: "الاسم الكامل مطلوب",
                })}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="password"
                className={`appearance-none rounded relative block w-full py-2 pr-2 pl-10 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="كلمة المرور"
                {...register("password", {
                  required: "كلمة المرور مطلوبة",
                  minLength: {
                    value: 8,
                    message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
                  },
                })}
              />
              {/* show password button */}
              <button
                type="button"
                className="absolute top-2 left-3 text-gray-400 z-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label htmlFor="passwordConfirmation" className="sr-only">
                تأكيد كلمة المرور
              </label>
              <input
                id="passwordConfirmation"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="password"
                className={`appearance-none rounded relative block w-full py-2 pr-2 pl-10 border ${
                  errors.passwordConfirmation
                    ? "border-red-500"
                    : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="تأكيد كلمة المرور"
                {...register("passwordConfirmation", {
                  required: "تأكيد كلمة المرور مطلوب",
                  validate: (value, formValues) =>
                    value === formValues.password ||
                    "كلمتا المرور غير متطابقتين",
                })}
              />
              <button
                type="button"
                className="absolute top-2 left-3 text-gray-400 z-10"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
              {errors.passwordConfirmation && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>
            {/* add radio button group for user type (client ot seller ) with values 0 ot 1 */}

            <Button
              className="w-full bg-[#194EB4] text-white hover:bg-[#153e8a]"
              type="submit"
              disabled={loading}
            >
              {loading ? "جاري التحميل..." : "إنشاء حساب"}
            </Button>

            <Separator />
            <div className="text-center">
              <p className="text-sm text-gray-500">
                هل لديك حساب بالفعل؟{" "}
                <Link to="/login" className="text-blue-500">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
