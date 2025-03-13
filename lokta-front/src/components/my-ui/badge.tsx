// components/Badge.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps {
  count: number;

  className?: string;
  children: React.ReactNode;
}

const BadgeComponent: React.FC<BadgeProps> = ({ count, className = "", children }) => {
  const showBadge = count > 0;

  return (
    <div className="relative inline-flex">
      {children}
      {showBadge && (
        <span
          className={cn(
            `absolute top-0.5 right-[1px] grid min-h-[24px] min-w-[24px]
             translate-x-2/4 -translate-y-2/4 place-items-center
              rounded-4xl bg-red-600 py-1 px-1 text-xs text-white`,
            className
          )}
        >
          {count}
        </span>
      )}
    </div>
  );
};

export default BadgeComponent;
