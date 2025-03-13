import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Subcategory from "../subcategory/subcategory";
import { Category } from "@/api/services/category/types";
import { useCategoryStore } from "@/zustand-stores/category-store";
import { useNavigate } from "react-router-dom";

type Props = Category;

function CategoriesSection({
  id,
  title,
  subCategories,
  description,
  image,
}: Props) {
  const setCurCategory = useCategoryStore((state) => state.setCurrentCategory);
  const setCurSubCategoryId = useCategoryStore(
    (state) => state.setCurSubCategoryId
  );
  const navigate = useNavigate();

  return (
    <div key={id} className="container mx-auto w-full">
      <p className="text-2xl md:text-4xl font-semibold text-center md:text-left my-8 capitalize">
        {title}
      </p>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {subCategories.map((subcategory: any) => {
            return (
              <CarouselItem
                key={subcategory.id}
                className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex justify-center items-center"
              >
                <Subcategory
                  {...subcategory}
                  title={subcategory.title}
                  image={subcategory.image}
                  onClick={() => {
                    setCurSubCategoryId(subcategory.id);
                    navigate(`/category/${id}`);
                    setCurCategory({
                      id,
                      title,
                      image,
                      subCategories,
                      description,
                    });
                  }}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default CategoriesSection;
