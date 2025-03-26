import { SubcategoryWithProducts } from "@/api/services/category/types";
import Hero from "@/components/my-ui/hero-component";
import { useEffect, useState } from "react";
import CategoriesSection from "./_components/categories-section/categories-section";
import { toast } from "sonner";
import { subcategorIesWithProductsApi } from "@/api/services/category/category-service";

function HomePage() {
  const [loading, setLoading] = useState(false);
  const [subcategoriesWithProducts, setSubcategoriesWithProducts] = useState<
    SubcategoryWithProducts[]
  >([]);

  useEffect(() => {
    fetchSubcategoriesWithProducts();
  }, []);

  const fetchSubcategoriesWithProducts = async () => {
    try {
      setLoading(true);
      const data = await subcategorIesWithProductsApi();
      setSubcategoriesWithProducts(data);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      <Hero />
      <div className="container mx-auto flex flex-col space-y-1.5">
        <p className="text-2xl md:text-4xl font-semibold text-center my-8 capitalize ">
          Shop All Categories
        </p>
        {subcategoriesWithProducts.length === 0 && (
          <div className="flex items-center justify-center">
            <p>No Products Found</p>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      {!loading &&
        subcategoriesWithProducts.map((sc) => <CategoriesSection {...sc} />)}
    </>
  );
}

export default HomePage;
