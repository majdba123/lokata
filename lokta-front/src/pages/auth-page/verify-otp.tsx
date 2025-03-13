import { verifyOtpApi } from "@/api/services/auth/auth-service";
import { Button } from "@/components/ui/button";
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
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      setIsLoading(true);
      await verifyOtpApi(data);
      toast.success(
        "Password reset successfully, check the new password in your email"
      );
      navigate("/login");
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white rounded-[10px]">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12"></div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white ">
        <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 rounded-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your email address and we'll send you a new password.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  {...register("email", { required: true })}
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    Email is required
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <label htmlFor="otp" className="sr-only">
                  OTP
                </label>
                <input
                  {...register("otp", { required: true })}
                  id="otp"
                  type="text"
                  className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Your OTP"
                />
                {errors.otp && (
                  <span className="text-red-500 text-sm">OTP is required</span>
                )}
              </div>
            </div>
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#194EB4] text-white hover:bg-[#153e8a]"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
