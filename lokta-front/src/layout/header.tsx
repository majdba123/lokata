import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLineIcon, BadgePlus, Megaphone } from "lucide-react";
import logo from "@/assets/lokta-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand-stores/auth.store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { resendOtpApi } from "@/api/services/auth/auth-service";

const Header: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const emailVerified = useAuthStore((state) => state.user?.email_verified_at);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resendVerificationEmail = async () => {
    try {
      toast.info("جاري ارسال الرابط");
      await resendOtpApi();
      toast.success(
        "تم ارسال الرابط بنجاح , برجاء التحقق من بريدك الإلكتروني وتفعيل الحساب , وقم بالتسجيل الدخول مرة اخرى"
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <header className="bg-white border-b py-2 md:py-3">
      <div className="container mx-auto px-4 flex items-center justify-between flex-col">
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Lokta Logo" className="h-10" />
          </Link>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <div className="flex items-center gap-2 px-2">
                <Button asChild variant={"ghost"} className="">
                  <Link to={"/profile/create-product"}>
                    {" "}
                    انشاء منتج جديد <BadgePlus />{" "}
                  </Link>
                </Button>
                <Button asChild variant={"ghost"}>
                  <Link to={"/ads/create"}>
                    {" "}
                    انشاء اعلانات جديد <Megaphone />{" "}
                  </Link>
                </Button>
              </div>
            )}
            <div className="flex items-center md:space-x-2 ">
              <span className="hidden md:inline">
                تسجيل {isAuthenticated ? "خروج" : "الدخول"}
              </span>

              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="rounded-4xl border"
              >
                <ArrowLeftFromLineIcon className="h-5 w-5 rotate-180" />
              </Button>
            </div>
          </div>
        </div>

        {isAuthenticated && !emailVerified && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <p className="w-fit cursor-pointer text-red-500 text-sm md:text-xl font-semibold">
                <span className="text-red-500">*</span> يرجى تفعيل حسابك من فضلك
              </p>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>تفعيل الحساب</AlertDialogTitle>
                <AlertDialogDescription>
                  يرجى تفعيل حسابك من فضلك, سيتم ارسال رابط الى الايميل الحاص بك
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={resendVerificationEmail}>
                  ارسال مرة اخرى
                </AlertDialogAction>
                <AlertDialogCancel>الغاء</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </header>
  );
};

export default Header;
