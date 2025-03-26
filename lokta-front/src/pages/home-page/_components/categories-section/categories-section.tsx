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
    <div key={id} className="container mx-auto w-full">
      <Link to={`/category`} onClick={() => setCurSubCategoryId(id)}>
        <p
          className="text-2xl md:text-4xl font-semibold text-center md:text-left capitalize
        hover:underline hover:underline-offset-4 my-5"
        >
          {title}
        </p>
      </Link>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product: Product) => {
            return (
              <>
                <CarouselItem
                  key={product.id}
                  className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex w-[250px] h-[350px]"
                >
                  <ProductCard
                    imageUrl={`${IMAGES_API_URL}/${product.images[0]}`}
                    originalPrice={product.price}
                    title={product.title}
                    owner_id={product.owner_id}
                  />
                </CarouselItem>
              </>
            );
          })}
        </CarouselContent>
        <div className="flex justify-center mt-4 sm:justify-end">
          <CarouselPrevious className="mr-2" />
          <CarouselNext />
        </div>
      </Carousel>
    </div>
  );
}

export default CategoriesSection;
