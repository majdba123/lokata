import Hero from "@/components/my-ui/hero-component";
import Newsletter from "@/components/my-ui/newsletter";
import CategoriesSection from "./_components/categories-section/categories-section";
import { Category } from "@/api/services/category/types";
import { useEffect, useState } from "react";
import { allCategoriesApi } from "@/api/services/category/category-service";

function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await allCategoriesApi();
      setCategories(response);
    };
    fetchCategories();
  }, []);
  return (
    <>
      <Hero />
      <div className="container mx-auto flex flex-col space-y-1.5">
        <p className="text-2xl md:text-4xl font-semibold text-center my-8 capitalize ">
          Shop All Categories
        </p>
        {categories.map((category: Category) => {
          return <CategoriesSection key={category.id} {...category} />;
        })}
      </div>

      <Newsletter />
    </>
  );
}

export default HomePage;
