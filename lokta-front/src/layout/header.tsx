import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLineIcon } from "lucide-react";
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
  const email = useAuthStore((state) => state.user?.email);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const resendVerificationEmail = async () => {
    try {
      await resendOtpApi(email!);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <header className="bg-white border-b py-2 md:py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Lokta Logo" className="h-8" />
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
          {!emailVerified && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <p className="w-fit cursor-pointer text-red-500 text-sm font-semibold">
                  <span className="text-red-500">*</span> يرجى تفعيل حسابك من
                  فضلك
                </p>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>تفعيل الحساب</AlertDialogTitle>
                  <AlertDialogDescription>
                    يرجى تفعيل حسابك من فضلك, سيتم ارسال رابط الى الايميل الحاص
                    بك
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
          <div className="flex items-center space-x-4">
            <span>تسجيل {isAuthenticated ? "خروج" : "الدخول"}</span>

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
    </header>
  );
};

export default Header;
