import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { Link, useNavigate } from "react-router-dom";
import useListenToChannel from "@/hooks/useListenToChannel";
import BadgeComponent from "@/components/my-ui/badge";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLogged = useAuthStore((state) => state.isAuthenticated);
  const userId = useAuthStore((state) => state.user?.id);
  const [msgsCount, setMsgsCount] = useState(0);

  useListenToChannel({
    onReceiveMessage: () => setMsgsCount(prev => prev + 1),
    userId: userId!,
    otherUserId: userId!,
  });

  useEffect(() => {
    return () => {
      setMsgsCount(0);
    };
  }, []);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleChatClick = () => {
    navigate(`/${isLogged ? "chat" : "login"}`);
  };

  return (
    <div dir="rtl" className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Categories Dropdown */}
          <div className="items-center gap-2 hidden md:flex">
            {/* Navigation Links (Hidden on small screens) */}
            <nav
              className={`hidden md:flex space-x-reverse space-x-4 ${
                isMenuOpen ? "flex flex-col mt-2 md:mt-0" : ""
              }`}
            >
              <Link
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                to="/"
              >
                الرئيسية
              </Link>
              <Link
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                to="/tyre"
              >
                إطارات السيارات
              </Link>

              <Link
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                to={`/${isLogged ? "profile/dashboard" : "login"}`}
              >
                الملف الشخصي
              </Link>
            </nav>
          </div>
          <BadgeComponent count={msgsCount}>
            <Button
              className={cn(
                "bg-[#194EB4] hover:bg-blue-700 text-white",
                "px-4 py-2 text-sm font-medium rounded-md cursor-pointer "
              )}
              onClick={handleChatClick}
            >
              <MessageCircleMore className="ml-1" />
              الدردشة{" "}
            </Button>
          </BadgeComponent>

          {/* Burger Menu (Visible on small screens) */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Navigation (Visible when menu is open) */}
        {isMenuOpen && (
          <nav className="flex flex-col mt-2 md:hidden">
            <Link
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              to="/"
            >
              الرئيسية
            </Link>
            <Link
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              to="/shop"
            >
              المتجر
            </Link>
            <Link
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              to={`/${isLogged ? "profile/dashboard" : "login"}`}
            >
              الملف الشخصي
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Navbar;
