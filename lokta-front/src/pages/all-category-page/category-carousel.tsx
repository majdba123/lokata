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
      }}
      className="w-full"
    >
      <CarouselContent dir="rtl" className="-ml-1.5">
        {subcategories.map((subcategory) => (
          <CarouselItem
            key={subcategory.id}
            className="pl-2 md:basis-1/4 lg:basis-1/6"
          >
            <CategoryItem
              categoryName={categoryName}
              subcategory={subcategory}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:flex items-center justify-center gap-5 mt-4">
        <CarouselPrevious className="static transform-none mr-2" />
        <CarouselNext className="static transform-none" />
      </div>
    </Carousel>
  );
}
