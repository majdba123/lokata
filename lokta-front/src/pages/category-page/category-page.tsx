import { getBrandsApi } from "@/api/services/brand/brand-service";
import { Brand } from "@/api/services/brand/types";
import { filterProductsApi } from "@/api/services/products/product-service";
import { Product } from "@/api/services/products/types";
import PriceRangeSlider from "@/components/my-ui/double-price-range";
import SalesBoard from "@/components/my-ui/sales-board";
import { useCategoryStore } from "@/zustand-stores/category-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import categoryBoard from "@/assets/Rectangle5.png";
import { useLocation } from "react-router-dom";
import useDebounce from "@/hooks/useDebounce";
import { ProductGrid } from "@/components/my-ui/product-grid";

function CategoryPage() {
  const location = useLocation();
  const { search } = location.state ? location.state : { search: "" };

  const [searchText, setSearchText] = useState<string>(search ?? "");
  const debouncedSearch = useDebounce(searchText, 500);

  const curSubCategoryId = useCategoryStore((state) => state.curSubCategoryId);
  const setCurSubCategoryId = useCategoryStore(
    (state) => state.setCurSubCategoryId
  );
  const subcategories = useCategoryStore((state) => state.subcategories);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [curBrandIdx, setCurBrandIdx] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const curSubCategory = subcategories.find((sc) => sc.id === curSubCategoryId);

  const fetchProducts = async () => {
    try {
      const data = await filterProductsApi({
        brand_id: curBrandIdx == -1 ? undefined : brands[curBrandIdx]?.id,
        sub_category_id:
          curSubCategoryId! == -1 ? undefined : curSubCategoryId!,
        min_price: priceRange[0],
        max_price: priceRange[1],
        search: debouncedSearch,
      });
      setProducts(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrandsApi();
        setBrands(data.brands);
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [
    curBrandIdx,
    curSubCategoryId,
    priceRange[0],
    priceRange[1],
    debouncedSearch,
  ]);

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  return (
    <div dir="rtl">
      <SalesBoard boardImage={categoryBoard} />
      <div className="w-full flex flex-col justify-center items-center space-y-2">
        <p className="text-xl ">
          {curSubCategoryId == -1 ? "الكل" : curSubCategory?.title}
        </p>
      </div>
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="lg:w-1/4 p-4 bg-white border-l border-gray-200">
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md 
          focus:outline-none focus:border-blue-500"
              placeholder="ابحث"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="absolute top-0 left-0 px-4 py-2 bg-blue-500 
          text-white rounded-l-md hover:bg-blue-600"
            >
              ابحث
            </button>
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">الفئة الفرعية</h3>
            </div>
            <div className="space-y-1">
              <label key={0} className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  name="subcategory"
                  value={-1}
                  onClick={() => setCurSubCategoryId(-1)}
                  checked={curSubCategoryId === -1}
                />
                <span className="mr-2">الكل</span>
              </label>
              {subcategories.map((sc) => (
                <label key={sc.id} className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="subcategory"
                    value={sc.id}
                    onClick={() => setCurSubCategoryId(sc.id)}
                    checked={sc.id === curSubCategoryId}
                  />
                  <span className="mr-2">{sc.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">العلامة التجارية</h3>
            </div>
            <div className="space-y-1">
              <label key={0} className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  name="brand"
                  value={-1}
                  onClick={() => setCurBrandIdx(-1)}
                  checked={curBrandIdx === -1}
                />
                <span className="mr-2">الكل</span>
              </label>
              {brands.map((item, idx) => (
                <label key={item.id} className="flex items-center">
                  <input
                    type="radio"
                    className="mr-2"
                    name="brand"
                    value={item.id}
                    onClick={() => setCurBrandIdx(idx)}
                    checked={idx === curBrandIdx}
                  />
                  <span className="mr-2">{item.name}</span>
                </label>
              ))}
            </div>
          </div>
          <PriceRangeSlider
            min={0}
            max={1000}
            step={2}
            currency="$"
            onChange={handlePriceChange}
          />
        </aside>

        {/* Product Grid */}
        <main className="flex-1 p-4">
          <ProductGrid products={products} />
        </main>
      </div>
    </div>
  );
}

export default CategoryPage;
