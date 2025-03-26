import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/zustand-stores/auth.store";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = [
  {
    name: "Dashboard",
    to: "/profile/dashboard",
    current: true,
    onClick: () => {},
    Icon: () => null,
  },
  {
    name: "Create Product",
    to: "/profile/create-product",
    current: false,
    onClick: () => {},
    Icon: () => null,
  },
  {
    name: "Create Brand",
    to: "/profile/create-brand",
    current: false,
    onClick: () => {},
    Icon: () => null,
  },

  {
    name: "My Products Dashboard",
    to: "/profile/my-products",
    current: false,
    onClick: () => {},
    Icon: () => null,
  },

  {
    name: "Logout",
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
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const handleClick = (tab: (typeof tabs)[number]) => {
    if (tab.name === "Logout") {
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
  return (
    <aside className="w-64 bg-white shadow-md h-fit ">
      <nav className="p-4">
        {curTabs.map((tab) => (
          <Button
            variant={tab.current ? "default" : "ghost"}
            className={cn("w-full text-left mb-2 capitalize", {
              "bg-[#194EB4]": tab.current,
              "text-white": tab.current,
              "hover:bg-[#194EB4]": tab.current,
            })}
            key={tab.name}
            onClick={() => handleClick(tab)}
          >
            {tab.name}
            <tab.Icon />
          </Button>
        ))}
      </nav>
    </aside>
  );
}

export default ProfileSidebar;
