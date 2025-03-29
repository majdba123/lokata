import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { changePasswordApi } from "@/api/services/auth/auth-service";

type Inputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    try {
      setIsLoading(true);
      await changePasswordApi(data);
      toast.success("تم تغيير كلمة المرور بنجاح");
      setIsLoading(false);
      reset();
    } catch (error: any) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };
  return (
    <Card dir="rtl">
      <CardHeader>
        <CardTitle>تغيير كلمة المرور</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="relative">
              <Input
                {...register("currentPassword", { required: "هذا الحقل مطلوب" })}
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور الحالية"
              />
              <button
                type="button"
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon size={20} />
                ) : (
                  <EyeIcon size={20} />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <span className="text-red-500 text-sm">
                {errors.currentPassword.message}
              </span>
            )}
          </div>
          <div>
            <Input
              {...register("newPassword", { required: "هذا الحقل مطلوب" })}
              type="password"
              placeholder="كلمة المرور الجديدة"
            />
            {errors.newPassword && (
              <span className="text-red-500 text-sm">
                {errors.newPassword.message}
              </span>
            )}
          </div>
          <div>
            <Input
              {...register("confirmPassword", { required: "هذا الحقل مطلوب" })}
              type="password"
              placeholder="تأكيد كلمة المرور"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "جاري التحميل..." : "تغيير كلمة المرور"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ChangePassword;
