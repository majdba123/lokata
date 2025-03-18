import { signupApi } from "@/api/services/auth/auth-service";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Inputs = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  type: 0 | 1;
};

function Signup() {
  const [loading, setLoading] = useState(false);
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
        type: data.type ?? 0,
      });
      toast.success("Account created successfully");
      setLoading(false);
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen ">
      {/* Left side with illustration */}
      <div className="hidden lg:flex lg:w-1/2  items-center justify-center p-12"></div>

      {/* Right side with sign up form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-10 bg-gray-100 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome To LOKTA
            </h2>
            <p className="mt-2 text-sm text-gray-600">Create New Account</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
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
              <label htmlFor="fullName" className="sr-only">
                Full Name{" "}
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="fullName"
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Full Name"
                {...register("fullName", {
                  required: "full Name is required",
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
                password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="password"
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must have at least 8 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="relative">
              <label htmlFor="passwordConfirmation" className="sr-only">
                Password Confirm
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                autoComplete="password"
                className={`appearance-none rounded relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password Confirmation"
                {...register("passwordConfirmation", {
                  required: "password Confirmation is required",
                  validate: (value, formValues) =>
                    value === formValues.password || "Passwords do not match",
                })}
              />
              {errors.passwordConfirmation && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.passwordConfirmation.message}
                </p>
              )}
            </div>
            {/* add radio button group for user type (client ot seller ) with values 0 ot 1 */}
            <div className="relative">
              <label htmlFor="type" className="sr-only">
                User Type
              </label>
              <div className="flex space-x-6 ">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="client"
                    {...register("type", { required: "User Type is required" })}
                    value={0}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="client" className="text-sm text-gray-700">
                    Client
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="seller"
                    {...register("type", { required: "User Type is required" })}
                    value={1}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="seller" className="text-sm text-gray-700">
                    Seller
                  </label>
                </div>
              </div>
              {errors.type && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.type.message}
                </p>
              )}
            </div>
            <Button
              className="w-full bg-[#194EB4] text-white hover:bg-[#153e8a]"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </Button>

            <Separator />
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500">
                  Log in
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
