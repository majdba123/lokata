import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeftFromLineIcon } from "lucide-react";
import logo from "@/assets/lokta-logo.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand-stores/auth.store";

const Header: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b py-2 md:py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Lokta Logo" className="h-8" />
        </Link>

        <div className="flex items-center space-x-2 md:space-x-4">
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
