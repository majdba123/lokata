import { Product } from "@/api/services/products/types";
import { useCategoryStore } from "@/zustand-stores/category-store";

import { ProductGrid } from "@/components/my-ui/product-grid";
import FilterSidebar from "./filter-sidebar";
import { useState } from "react";
import AdsBoard from "../ads/ads-board";

const ads = [
  {
    src: `https://picsum.photos/seed/${
      Math.random() * new Date().getTime()
    }/600/300`,
    link: "https://google.com",
  },
  {
    src: `https://picsum.photos/seed/${Math.random()}/600/300`,
    link: "https://google.com",
  },
  {
    src: `https://picsum.photos/seed/${Math.random() * 33}/600/300`,
    link: "https://google.com",
  },
];
function CategoryPage() {
  const curSubCategoryId = useCategoryStore((state) => state.curSubCategoryId);
  const subcategories = useCategoryStore((state) => state.subcategories);
  const curSubCategory = subcategories.find((sc) => sc.id === curSubCategoryId);
  const [products, setProducts] = useState<Product[]>([]);

  const onFetchProducts = (products: Product[]) => {
    setProducts(products);
  };

  return (
    <div dir="rtl">
      <AdsBoard ads={ads} type="slide" />
      <div className="w-full flex flex-col justify-center items-center space-y-2">
        <p className="text-xl ">
          {curSubCategoryId == -1 ? "الكل" : curSubCategory?.title}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <FilterSidebar onFetchProducts={onFetchProducts} />

        {/* Product Grid */}
        <main className="flex-1 p-4">
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}

export default CategoryPage;
