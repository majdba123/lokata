import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftFromLineIcon,
  Heart,
  Search,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import logo from "@/assets/lokta-logo.svg";
import BadgeComponent from "@/components/my-ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand-stores/auth.store";

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isLogged = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (!isLogged) {
      navigate("/login");
      return;
    }
    navigate("/profile/dashboard");
  };

  return (
    <header className="bg-white border-b py-2 md:py-3">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={logo} alt="Lokta Logo" className="h-8" />
        </div>
        <div className="relative w-auto lg:w-[498px]">
          <Input
            type="text"
            placeholder="search for product, delivered to your door..."
            className="w-full pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Burger Menu for Small Screens */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Sidebar for Small Screens */}
          <div
            className={` z-20 fixed top-0 right-0 h-full w-64 bg-white border-l shadow-md transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
          >
            <div className="p-4 flex justify-end">
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 flex flex-col space-y-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-4xl border"
                onClick={handleProfileClick}
              >
                <UserPlus className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-4xl border"
                onClick={handleLogout}
              >
                <ArrowLeftFromLineIcon className="h-5 w-5 rotate-180" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-4xl border"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Buttons for Larger Screens */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-4xl border "
              onClick={handleProfileClick}
            >
              <UserPlus className="h-5 w-5" />
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="rounded-4xl border"
            >
              <ArrowLeftFromLineIcon className="h-5 w-5 rotate-180" />
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <BadgeComponent count={5} className="bg-[#194EB4]">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-4xl border"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </BadgeComponent>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
