import { useForm, SubmitHandler } from "react-hook-form";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loginApi } from "@/api/services/auth/auth-service";

type Inputs = {
  email: string;
  password: string;
};

function Login() {
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
    }
  };

  return (
    <div className="flex min-h-screen bg-white rounded-[10px]">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"></div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white ">
        <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 rounded-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please sign in to your account
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className=" flex flex-col space-y-4">
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <Mail
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none rounded relative block w-full px-3 py-2 pl-10 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Entered value does not match email format",
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
                  Password
                </label>
                <Lock
                  className="absolute top-3 left-3 text-gray-400"
                  size={20}
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={`appearance-none rounded relative block w-full px-3 py-2 pl-10 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                />
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
                  Forgot your password?
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
                    Loading ...
                  </p>
                ) : (
                  "Sign in"
                )}
              </Button>
            </div>
          </form>
          <Separator />
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
