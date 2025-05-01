import { cn } from "@/lib/utils";
import { Subcategory } from "@/api/services/category/types";
import { Link } from "react-router-dom";

interface CategoryItemProps {
  subcategory: Subcategory;
  className?: string;
  categoryName : string
}

export function CategoryItem({ subcategory, className, categoryName }: CategoryItemProps) {
  return (
    <Link
      to={`/${categoryName}/${subcategory.title}`}
      className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative w-full pt-[100%] overflow-hidden rounded-full border border-border group">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={subcategory.image}
            alt={subcategory.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>
      <span className="text-sm md:text-base font-medium text-center">
        {subcategory.title}
      </span>
    </Link>
  );
}
