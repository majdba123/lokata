import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SubcategoryWithProducts } from "@/api/services/category/types";
import ProductCard from "@/components/my-ui/product-card";
import { IMAGES_API_URL } from "@/api/constants";
import { Product } from "@/api/services/products/types";
import { Link } from "react-router-dom";
import { useCategoryStore } from "@/zustand-stores/category-store";

type Props = SubcategoryWithProducts;

function CategoriesSection({ id, title, products }: Props) {
  const setCurSubCategoryId = useCategoryStore((s) => s.setCurSubCategoryId);

  return (
    <div dir="rtl" key={id} className="container mx-auto w-full">
      <Link to={`/category`} onClick={() => setCurSubCategoryId(id)}>
        <p
          className="text-2xl md:text-4xl font-semibold text-center md:text-right capitalize
        hover:underline hover:underline-offset-4 my-5"
        >
          {title}
        </p>
      </Link>

      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            direction: "rtl", // Set direction to RTL for Embla Carousel
          }}
          className="w-full"
        >
          {/* For RTL, we use -ml-4 instead of -mr-4 because the carousel's internal logic still works in LTR */}
          <CarouselContent className="-ml-2 sm:-ml-4">
            {products.map((product: Product) => (
              <CarouselItem
                key={product.id}
                className="pl-2 sm:pl-4 xs:basis-1/2 sm:basis-1/4 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard
                  imageUrl={`${IMAGES_API_URL}/${product.images[0]}`}
                  originalPrice={product.price}
                  title={product.title}
                  owner_id={product.owner_id}
                  currency={product.currency}
                  description={product.description ?? ""}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons positioned absolutely for better control */}
          {products.length > 4 && (
            <div className="flex justify-center w-full mt-4">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <CarouselPrevious className="relative h-7 w-7 sm:h-8 sm:w-8 rtl:order-last" />
                <CarouselNext className="relative h-7 w-7 sm:h-8 sm:w-8 rtl:order-first" />
              </div>
            </div>
          )}
        </Carousel>
      </div>
    </div>
  );
}

export default CategoriesSection;
