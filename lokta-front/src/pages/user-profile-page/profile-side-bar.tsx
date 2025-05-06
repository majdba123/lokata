import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  {
    name: "لوحة التحكم", // Dashboard
    to: "/profile/dashboard",
    current: true,
    onClick: () => {},
    Icon: () => null,
  },
  {
    name: "إنشاء منتج", // Create Product
    to: "/profile/create-product",
    current: false,
    onClick: () => {},
    Icon: () => null,
  },
  {
    name: "منتجاتي", // My Products Dashboard
    to: "/profile/my-products",
    current: false,
    onClick: () => {},
    Icon: () => null,
  },

  {
    name: "تسجيل الخروج", // Logout
    to: "/login",
    current: false,
    onClick: (cb: () => void) => {
      cb();
    },
    Icon: () => <LogOut />,
  },
];

function ProfileSidebar() {
  const [curTabs, setCurTabs] = useState<typeof tabs>(tabs);
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const handleClick = (tab: (typeof tabs)[number]) => {
    if (tab.name === "تسجيل الخروج") {
      tab.onClick(logout);
    }
    navigate(tab.to);
    setCurTabs(
      tabs.map((t) => {
        if (t.name === tab.name) {
          return { ...t, current: true };
        } else {
          return { ...t, current: false };
        }
      })
    );
  };

  useEffect(() => {
    setCurTabs(
      tabs.map((t) => {
        if (t.to === location.pathname) {
          return { ...t, current: true };
        } else {
          return { ...t, current: false };
        }
      })
    );
  }, [location.pathname]);

  return (
    <aside dir="rtl" className="w-64 bg-white shadow-md h-fit ">
      <nav className="p-4">
        {curTabs.map((tab) => (
          <Button
            variant={tab.current ? "default" : "ghost"}
            className={cn(
              "w-full text-right mb-2 capitalize flex items-center justify-between",
              {
                "bg-[#194EB4]": tab.current,
                "text-white": tab.current,
                "hover:bg-[#194EB4]": tab.current,
              }
            )}
            key={tab.name}
            onClick={() => handleClick(tab)}
          >
            {tab.name}
          </Button>
        ))}
      </nav>
    </aside>
  );
}

export default ProfileSidebar;
