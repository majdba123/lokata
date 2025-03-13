import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Flame, Menu } from "lucide-react"; // Added Menu icon
import { useState } from "react"; // Added useState
import categories_logo from "@/assets/categories.svg";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Added state for menu
  const isLogged = useAuthStore((state) => state.isAuthenticated);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Categories Dropdown */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <img
                    src={categories_logo}
                    alt="Categories"
                    className="h-5 w-5"
                  />
                  <span>All Categories</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Electronics</DropdownMenuItem>
                <DropdownMenuItem>Clothing</DropdownMenuItem>
                <DropdownMenuItem>Home & Garden</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Navigation Links (Hidden on small screens) */}
            <nav
              className={`hidden md:flex space-x-4 ${
                isMenuOpen ? "flex flex-col mt-2 md:mt-0" : ""
              }`}
            >
              <Link
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                to="/"
              >
                Home
              </Link>
              <Link
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                to="/shop"
              >
                Shop
              </Link>

              <Link
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                to={`/${isLogged ? "profile/dashboard" : "login"}`}
              >
                Profile
              </Link>
            </nav>
          </div>

          {/* Hot Deals Button */}
          <Button
            className={cn(
              "bg-[#194EB4] hover:bg-blue-700 text-white",
              "px-4 py-2 text-sm font-medium rounded-md cursor-pointer"
            )}
          >
            <Flame fill="white" />
            Hot Deals
          </Button>

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
              Home
            </Link>
            <Link
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              to="/shop"
            >
              Shop
            </Link>
            <Link
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              to={`/${isLogged ? "profile/dashboard" : "login"}`}
            >
              Profile
            </Link>{" "}
            
          </nav>
        )}
      </div>
    </div>
  );
}

export default Navbar;
