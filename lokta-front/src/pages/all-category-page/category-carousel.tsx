import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Subcategory } from "@/api/services/category/types";
import { CategoryItem } from "./category-item";

interface CategoryCarouselProps {
  subcategories: Subcategory[];
  categoryName: string;
}

export function CategoryCarousel({
  subcategories,
  categoryName,
}: CategoryCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        direction: "rtl",
      }}
      className="w-full"
      dir="rtl"
    >
      <CarouselContent className="-ml-2">
        {subcategories.map((subcategory) => (
          <CarouselItem
            key={subcategory.id}
            className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8 pl-2"
          >
            <CategoryItem
              categoryName={categoryName}
              subcategory={subcategory}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:flex items-center justify-center gap-5 mt-4">
        <CarouselPrevious className="static transform-none rotate-180" />
        <CarouselNext className="static transform-none rotate-180" /> 
      </div>
    </Carousel>
  );
}
