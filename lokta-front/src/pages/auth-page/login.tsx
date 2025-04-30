import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loginApi } from "@/api/services/auth/auth-service";
import { useState } from "react";

type Inputs = {
  email: string;
  password: string;
};

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<Inputs>();

  const navigate = useNavigate();
  const _login = useAuthStore((state) => state.login);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await loginApi({
        email: data.email,
        password: data.password,
      });
      _login(res);
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
      toast.error("خطأ في تسجيل الدخول");
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen bg-white rounded-[10px]">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"></div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white ">
        <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 rounded-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              مرحبا بعودتك
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              الرجاء تسجيل الدخول إلى حسابك
            </p>
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
                  className={`appearance-none rounded relative block w-full  py-2 pr-10 border ${
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
                <label htmlFor="password" className="sr-only">
                  كلمة المرور
                </label>
                <Lock
                  className="absolute top-3 right-3 text-gray-400"
                  size={20}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`appearance-none rounded relative block w-full pl-10 py-2 pr-10 border ${
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
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forget-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  هل نسيت كلمة المرور؟
                </Link>
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
                  "تسجيل الدخول"
                )}
              </Button>
            </div>
          </form>
          <Separator />
          <div className="text-center">
            <p className="text-sm text-gray-500">
              ليس لديك حساب؟{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                سجل الآن
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
